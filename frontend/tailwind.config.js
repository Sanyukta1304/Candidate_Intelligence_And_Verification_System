/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Design System - Primary Colors
        'primary-teal': '#0D9488',
        'primary-navy': '#0F172A',
        
        // Design System - Secondary Colors
        'teal-light': '#CCFBF1',
        'slate-grey': '#475569',
        'grey-mild': '#F1F5F9',
        'white-primary': '#FFFFFF',
        
        // Status Badge Colors
        'status-success': '#DCFCE7',
        'status-success-text': '#15803d',
        'status-warning': '#FEF9C3',
        'status-warning-text': '#ca8a04',
        'status-error': '#FEE2E2',
        'status-error-text': '#dc2626',
        'status-neutral': '#F1F5F9',
        'status-neutral-text': '#475569',
        
        // Legacy slate for compatibility
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        
        // Badge colors for tier ratings
        badge: {
          highPotential: {
            bg: "#d1fae5",
            text: "#047857",
          },
          moderate: {
            bg: "#fed7aa",
            text: "#92400e",
          },
          entryLevel: {
            bg: "#dbeafe",
            text: "#1e40af",
          },
          specialist: {
            bg: "#e9d5ff",
            text: "#7e22ce",
          },
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['Courier', 'Courier New', 'monospace'],
      },
      fontSize: {
        'heading-1': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-3': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-4': ['16px', { lineHeight: '1.5', fontWeight: '700' }],
        'body': ['10px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['8px', { lineHeight: '1.4', fontWeight: '700' }],
        'caption': ['9px', { lineHeight: '1.4', fontWeight: '400' }],
        'navbar': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'navbar-secondary': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
      },
      spacing: {
        'gap-xs': '4px',
        'gap-sm': '8px',
        'gap-md': '16px',
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'input': '6px',
      },
    },
  },
  plugins: [],
}
