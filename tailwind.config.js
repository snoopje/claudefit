/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        lime: 'var(--lime)',
        'lime-dim': 'var(--lime-dim)',
        ember: 'var(--ember)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        muted: 'var(--muted)',
        'text-secondary': 'var(--text-secondary)',
        'text-dim': 'var(--text-dim)',
        'text-ghost': 'var(--text-ghost)',
        'text-invisible': 'var(--text-invisible)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(3rem, 8vw, 6.5rem)',
        'section': 'clamp(2.5rem, 6vw, 5rem)',
      },
      letterSpacing: {
        'widest-plus': '0.3em',
      },
      animation: {
        'up': 'up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'right': 'right 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale': 'scale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        up: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        right: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
