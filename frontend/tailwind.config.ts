import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#13131a',
        'surface-2': '#1a1a24',
        border: '#2a2a36',
        primary: { DEFAULT: '#d97706', hover: '#ea8a14', glow: '#d9770633' },
        accent: { DEFAULT: '#f59e0b', muted: '#92400e' },
        text: { DEFAULT: '#f5f5f4', muted: '#a1a1aa', subtle: '#71717a' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: { glow: '0 0 30px rgba(217, 119, 6, 0.2)', 'glow-strong': '0 0 50px rgba(217, 119, 6, 0.35)', card: '0 4px 24px rgba(0, 0, 0, 0.4)' },
    },
  },
  plugins: [],
};

export default config;
