const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
  extend: {
      colors: {
        bada55: '#bada55',
        neonb: {
          900: '#16121c',
          700: '#201930',
          500: '#201b2a',
          300: '#3d3350'
        },
        neonf: {
          100: '#4fe5fa',
          300: '#72f1b8',
          400: '#46899c',
          900: '#1a4c52'
        }
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
        dark: '0 4px 3px rgba(255, 255, 255, 0.15)',
        neon: [
          '0 0 1px rgba(255,255,255,0.4)',
          '0 0 5px rgba(255,255,255,0.4)',
          '0 0 7px rgba(255,255,255,0.4)',
          '0 0 8px rgba(0, 255, 128, 0.4)',
          '0 0 10px rgba(0, 255, 128, 0.4)',
          '0 0 15px rgba(0, 255, 128, 0.4)',
          '0 0 20px rgba(0, 255, 128, 0.4)',
          '0 0 150px rgba(0, 255, 128, 0.4)'
        ],
        'neon-md': [
          '0 0 3px rgb(0 255 128 / 0.5)',
          '0 0 2px rgb(0 255 128 / 0.5)'
        ],
        'neon-red': [
          '0 0 1px rgba(255,255,255,0.4)',
          '0 0 5px rgba(255,255,255,0.4)',
          '0 0 7px rgba(255,255,255,0.4)',
          '0 0 8px rgba(255, 128, 0, 0.4)',
          '0 0 10px rgba(255, 128, 0, 0.4)',
          '0 0 15px rgba(255, 128, 0, 0.4)',
          '0 0 20px rgba(255, 128, 0, 0.4)',
          '0 0 150px rgba(255, 128, 0, 0.4)'
        ],
        'neon-red-md': [
          '0 0 3px rgb(255 128 0 / 0.5)',
          '0 0 2px rgb(255 128 0 / 0.5)'
        ],
      },
      animation: {
        glow: 'glow 5s infinite alternate',
        'glow-md': 'glow-md 10s infinite alternate',
      },
      keyframes: {
        glow: {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { filter: "drop-shadow(0 0 1px rgba(255,255,255,0.4)) drop-shadow(0 0 5px rgba(255,255,255,0.4)) drop-shadow(0 0 7px rgba(255,255,255,0.4)) drop-shadow(0 0 8px rgba(0, 255, 128, 0.4)) drop-shadow(0 0 10px rgba(0, 255, 128, 0.4)) drop-shadow(0 0 15px rgba(0, 255, 128, 0.4)) drop-shadow(0 0 20px rgba(0, 255, 128, 0.4)) drop-shadow(0 0 150px rgba(0, 255, 128, 0.4))" },
          '20%, 24%, 55%': { filter: "none" }
        },
        'glow-md': {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { filter: "drop-shadow(0 0 3px rgb(0 255 128 / 0.5)) drop-shadow(0 0 2px rgb(0 255 128 / 0.5))" },
          '20%, 24%, 55%': { filter: "none" }
        }
      },
      typography: ({ theme }) => ({
        neon: {
          css: {
            '--tw-prose-body': theme('colors.neonf[100]'),
            '--tw-prose-headings': theme('colors.neonf[100]'),
            '--tw-prose-lead': theme('colors.neonf[100]'),
            '--tw-prose-links': theme('colors.neonf[300]'),
            '--tw-prose-bold': theme('colors.neonf[100]'),
            '--tw-prose-counters': theme('colors.neonf[100]'),
            '--tw-prose-bullets': theme('colors.neonf[100]'),
            '--tw-prose-hr': theme('colors.neonf[300]'),
            '--tw-prose-quotes': theme('colors.neonf[100]'),
            '--tw-prose-quote-borders': theme('colors.neonf[300]'),
            '--tw-prose-captions': theme('colors.neonf[100]'),
            '--tw-prose-code': theme('colors.neonf[100]'),
            '--tw-prose-pre-code': theme('colors.neonf[100]'),
            '--tw-prose-pre-bg': theme('colors.neonf[100]'),
            '--tw-prose-th-borders': theme('colors.neonf[100]'),
            '--tw-prose-td-borders': theme('colors.neonf[100]'),
          }
        }
      })
    },
  },

  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography'),plugin(function({addVariant}) {
    addVariant('neon', '.neon &')
  })],
}