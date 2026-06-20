import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 28px rgba(15, 23, 42, 0.05)',
        soft: '0 1px 2px rgba(15, 23, 42, 0.06)',
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        surface: {
          50: '#f6f7fb',
          100: '#eef1f6',
          200: '#e3e7ef',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

