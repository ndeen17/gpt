/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            pre: {
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              marginTop: '1em',
              marginBottom: '1em',
            },
            code: {
              color: '#374151',
              backgroundColor: '#f3f4f6',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};