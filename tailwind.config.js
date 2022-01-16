module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
  extend: {
      colors: {
        bada55: '#bada55',
      },
      fontFamily: {
        sans: [
          'Inter var',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      dropShadow: {
        dark: '0 4px 3px rgba(255, 255, 255, 0.15)'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography'),],
}