import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              fontWeight: '700',
              marginBottom: '1rem',
            },
            h2: {
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '1rem',
            },
            h3: {
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '1rem',
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
            },
            p: {
              marginBottom: '1rem',
              lineHeight: '1.625',
            },
            'ul, ol': {
              marginBottom: '1rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginBottom: '0.5rem',
            },
            a: {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            sup: {
              fontSize: '0.75em',
              a: {
                color: '#2563eb',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            },
            strong: {
              fontWeight: '600',
              color: 'inherit',
            },
          },
        },
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.75',
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
} 