/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        brand: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#7928ca',
          pink: '#ff0080',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
        dark: {
          bg: '#0a0d14',
          surface: '#0f172a',
          card: 'rgba(15, 23, 42, 0.75)',
          cardHover: 'rgba(30, 41, 59, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(0, 242, 254, 0.25)',
        },
        theme: {
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          accent: 'var(--theme-accent-3)',
          bg: 'var(--theme-bg)',
          surface: 'var(--theme-surface)',
          card: 'var(--theme-card)',
          glow: 'var(--theme-glow)',
          border: 'var(--theme-border-accent)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
}
