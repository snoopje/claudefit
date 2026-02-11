/**
 * Application entry point
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize default data in localStorage
import { initializeDefaults } from './services/storage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Initialize localStorage defaults
initializeDefaults()
