/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'civic-primary': '#2b684c',
        'civic-secondary': '#47a378',
        'civic-accent': '#a1dbba',
        'civic-cream': '#fafaf9',
        'civic-dark': '#1c1917',
        'civic-green': '#3F7D4A',
        'civic-green-dark': '#285D36',
        'civic-green-light': '#DDEEDB',
        'civic-sage': '#9DBB98',
        'civic-surface': '#FFFFFF',
        'civic-surface-soft': '#EEF4EA',
        'civic-text': '#14231B',
        'civic-muted': '#5F6E65',
        'civic-border': '#DDE4DA',
        'civic-warning': '#D59A32',
        'civic-danger': '#C95C4D',
        'civic-info': '#5F91B5',
        civic: {
          50: '#f4fbf7',
          100: '#e5f6eb',
          200: '#caecd7',
          300: '#a1dbba',
          400: '#6fc197',
          500: '#47a378',
          600: '#34835e',
          700: '#2b684c',
          800: '#24533e',
          900: '#1e4434',
          950: '#0f261d',
        },
      },
    },
  },
  plugins: [],
};
