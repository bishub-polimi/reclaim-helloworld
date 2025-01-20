import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        red: "#dc2626",
        newred: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        stone: "#f5f5f4",
        black: "#000000",
        green: "#008000",
        grey: "#e5e7eb"
      },
      keyframes: {
        shine: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'shine-once': 'shine 1s ease-in-out'
      }
    },
  },
  plugins: [],
} satisfies Config;