/**
 * Settings Page - Data export/import, clear data, preferences
 */

import { useState } from 'react'
import { MainLayout, PageSection, AmbientGlow, PageGrid } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal, ConfirmDialog } from '../../components/ui/Modal'
import { exportAndDownloadData } from '../../services/export'
import { clearAllData, checkStorageHealth } from '../../services/storage'
import { getNutritionTargets, updateNutritionTargets } from '../../services/nutrition'

export function SettingsPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showTargetsModal, setShowTargetsModal] = useState(false)

  const [targets, setTargets] = useState(getNutritionTargets())
  const [storageHealth] = useState(checkStorageHealth())

  const handleExportAll = () => {
    exportAndDownloadData()
  }

  const handleImport = (replace: boolean) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        // Simple validation - check if it has required fields
        if (!data.version || !data.exportDate) {
          alert('Invalid file format')
          return
        }

        // For now, just replace all data
        clearAllData()

        // Restore data from file
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'version' && key !== 'exportDate' && typeof value !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value))
          }
        })

        window.location.reload()
      } catch {
        alert('Failed to read file. Please ensure it is a valid JSON file.')
      }
    }

    input.click()
  }

  const handleClearData = () => {
    clearAllData()
    window.location.reload()
  }

  const storageUsedMB = (storageHealth.sizeInfo.used / (1024 * 1024)).toFixed(2)
  const storageRemainingMB = (storageHealth.sizeInfo.remaining / (1024 * 1024)).toFixed(2)

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Settings"
        subtitle="Manage your data and preferences"
      >
        {/* Data Management */}
        <PageSection label="Data" title="Data Management">
          <PageGrid columns={2}>
            <Card variant="elevated" padding="lg">
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-2">
                Export Data
              </h3>
              <p className="font-mono text-xs text-text-dim mb-4">
                Download all your data as a JSON file for backup or transfer
              </p>
              <Button onClick={handleExportAll} fullWidth>
                Export All Data
              </Button>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-2">
                Import Data
              </h3>
              <p className="font-mono text-xs text-text-dim mb-4">
                Restore from a backup file
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleImport(false)} fullWidth>
                  Import
                </Button>
              </div>
            </Card>
          </PageGrid>

          {/* Storage Info */}
          <Card variant="bordered" padding="md" className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-1">
                  / Storage Usage
                </h4>
                <p className="font-mono text-sm text-foreground">
                  {storageUsedMB} MB used / ~{storageRemainingMB} MB available
                </p>
              </div>
              {storageHealth.hasQuotaIssue && (
                <Badge variant="ember">Low Space</Badge>
              )}
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="bordered" padding="md" className="mt-4 border-red-600/30">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 mb-2">
              / Danger Zone
            </h4>
            <p className="font-mono text-xs text-text-dim mb-4">
              Clear all data from localStorage. This cannot be undone.
            </p>
            <Button variant="danger" onClick={() => setShowClearConfirm(true)}>
              Clear All Data
            </Button>
          </Card>
        </PageSection>

        {/* Preferences */}
        <PageSection label="Preferences" title="Nutrition Targets">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-1">
                  Daily Targets
                </h3>
                <p className="font-mono text-xs text-text-dim">
                  {targets.dailyCalories} kcal | {targets.protein}g P | {targets.carbs}g C | {targets.fat}g F
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowTargetsModal(true)}>
                Edit
              </Button>
            </div>
          </Card>
        </PageSection>

        {/* About */}
        <PageSection label="About" title="ClaudeFit">
          <Card variant="bordered" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-lime flex items-center justify-center">
                <span className="font-display text-xl text-background">C</span>
              </div>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
                  ClaudeFit
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                  Version 1.0.0
                </p>
              </div>
            </div>
            <p className="font-mono text-xs text-text-dim">
              A comprehensive fitness tracker with Dark Industrial design. All data is stored locally in your browser.
            </p>
          </Card>
        </PageSection>
      </MainLayout>

      {/* Targets Modal */}
      <Modal
        isOpen={showTargetsModal}
        onClose={() => setShowTargetsModal(false)}
        title="Daily Nutrition Targets"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowTargetsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              updateNutritionTargets(targets)
              setShowTargetsModal(false)
            }}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Daily Calories"
            type="number"
            value={targets.dailyCalories.toString()}
            onChange={(e) => setTargets({ ...targets, dailyCalories: parseFloat(e.target.value) || 2000 })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              value={targets.protein.toString()}
              onChange={(e) => setTargets({ ...targets, protein: parseFloat(e.target.value) || 150 })}
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={targets.carbs.toString()}
              onChange={(e) => setTargets({ ...targets, carbs: parseFloat(e.target.value) || 200 })}
            />
            <Input
              label="Fat (g)"
              type="number"
              value={targets.fat.toString()}
              onChange={(e) => setTargets({ ...targets, fat: parseFloat(e.target.value) || 65 })}
            />
          </div>
        </div>
      </Modal>

      {/* Clear Data Confirmation */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to delete all your data? This action cannot be undone. Consider exporting your data first."
        confirmText="Clear All Data"
        variant="danger"
      />
    </>
  )
}
