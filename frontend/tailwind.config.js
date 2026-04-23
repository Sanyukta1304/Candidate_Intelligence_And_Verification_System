/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#2D333F",
          light: "#F5F7FA",
        },
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
<<<<<<< HEAD
=======
        // Badge colors for tier ratings
        badge: {
          highPotential: {
            bg: "#d1fae5",  // emerald-100
            text: "#047857", // emerald-800
          },
          moderate: {
            bg: "#fed7aa",   // orange-100
            text: "#92400e", // orange-800
          },
          entryLevel: {
            bg: "#dbeafe",   // blue-100
            text: "#1e40af", // blue-800
          },
          specialist: {
            bg: "#e9d5ff",   // purple-100
            text: "#7e22ce", // purple-800
          },
        },
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}
