/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Unique Solar Flame / Electric Amber-Orange Primary
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Cyber Teal / Radiant Aqua Accent
        cyan: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          50: '#fcfcfd',
          100: '#f5f6f9',
          200: '#e9ebf2',
          300: '#d0d5e2',
          800: '#161c28',
          900: '#0b0f19',
          950: '#060810',
        }
      },
      fontFamily: {
        sans: ['Outfit', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px -5px rgba(234, 88, 12, 0.4)',
        'glow-sm': '0 0 16px -3px rgba(234, 88, 12, 0.25)',
        'glow-cyan': '0 0 30px -5px rgba(20, 184, 166, 0.4)',
        'glow-teal': '0 0 30px -5px rgba(20, 184, 166, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'premium': '0 20px 40px -15px rgba(11, 15, 25, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(11, 15, 25, 0.05)',
        'card-hover': '0 16px 36px -4px rgba(234, 88, 12, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}