/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { bg: '#0B0C0E', surface: '#14161B', elevated: '#1B1E26' },
        clarity: { gold: '#D4AF37', goldHover: '#E5C158', goldDim: 'rgba(212,175,55,0.15)' },
        leak: { red: '#EF4444', dim: 'rgba(239,68,68,0.15)' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
      borderColor: { subtle: 'rgba(255,255,255,0.08)', elevated: 'rgba(255,255,255,0.14)' },
    },
  },
  plugins: [],
};
