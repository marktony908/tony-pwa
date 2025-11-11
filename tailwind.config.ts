import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        seaweed: {
          50: '#f0f9f5',
          100: '#dcf2e8',
          200: '#bce5d3',
          300: '#8dd1b4',
          400: '#57b591',
          500: '#2d9474', // Main seaweed green
          600: '#1f7560',
          700: '#1a5d4e',
          800: '#174a3f',
          900: '#153e35',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
  plugins: [],
}
export default config

