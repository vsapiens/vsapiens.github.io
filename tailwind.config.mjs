/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d1117',
          elevated: '#161b22',
          surface: '#1c2333',
        },
        accent: {
          purple: '#a78bfa',
          'purple-dim': '#7c5cbf',
          'purple-glow': 'rgba(167, 139, 250, 0.3)',
        },
        text: {
          primary: '#c9d1d9',
          secondary: '#8b949e',
          heading: '#e6edf3',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
