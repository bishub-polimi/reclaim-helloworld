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
        stone: "#f5f5f4",
        black: "#000000",
        green: "#008000"
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