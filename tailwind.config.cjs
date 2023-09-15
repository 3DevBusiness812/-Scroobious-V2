/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        shimmerfrms: {
          '0%': {
            transform: "translateX(-100%)",
            opacity: 1
          },
          '100%': {
            transform: 'translateX(0%);',
            opacity: 0
          }
        },
        easeInOutElastic: {
          '0%': {
            transform: 'scale(1.1)',
            opacity: 1
          },

          '4%': {
            transform: 'scale(1.1)',
          },

          '8%': {
            transform: 'scale(1.1)',
          },

          '18%': {
            transform: 'scale(1.11)',
          },

          '20%': {
            transform: 'scale(1.1)'
          },

          '28%': {
            transform: 'scale(1.08)',
          },

          '30%': {
            transform: 'scale(1.08)',
          },

          '38%': {
            transform: 'scale(1.19)',
          },

          '40%': {
            transform: 'scale(1.22)',
          },

          '60%': {
            transform: 'scale(0.99)',
            opacity: 0.25
          },

          '62%': {
            transform: 'scale(1.01)',
          },

          '70%': {
            transform: 'scale(1.02)',
          },

          '72%': {
            transform: 'scale(1.02)',
          },

          '80%': {
            transform: 'scale(1.02)',
          },

          '82%': {
            transform: 'scale(0.99)',
          },

          '90%': {
            transform: 'scale(1)',
          },

          '92%': {
            transform: 'scale(1)',
          },

          '100%': {
            transform: 'scale(1)',
            opacity: 1
          }
        }

      },
      animation: {
        'type-dot': 'easeInOutElastic 1.5s infinite alternate',
        'shimmer': 'shimmerfrms 25s ease-out infinite'
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
}
