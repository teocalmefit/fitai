/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121212',
        card: '#1E1E1E',
        primary: {
          DEFAULT: '#a855f7',
          hover: '#9333ea',
          light: '#c084fc',
          dark: '#7e22ce',
        },
        secondary: {
          DEFAULT: '#ec4899',
          hover: '#db2777',
          light: '#f472b6',
          dark: '#be185d',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        success: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dark: '#16a34a',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        surface: {
          DEFAULT: '#2a2a2a',
          light: '#3a3a3a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          disabled: '#71717a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(168, 85, 247, 0.5)',
        'glow-secondary': '0 0 15px rgba(236, 72, 153, 0.5)',
      },
    },
  },
  plugins: [],
};