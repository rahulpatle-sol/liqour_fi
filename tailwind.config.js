/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#0B0E11',
        secondary: '#161A1E',
        card:      '#1E2329',
        hover:     '#252A2F',
        border:    '#2B3139',
        'border-l':'#363C45',
        orange:    '#FF8A57',
        ocean:     '#2E88B6',
        sky:       '#9FE0FF',
        peach:     '#FFD1BB',
        long:      '#0ECB81',
        short:     '#F6465D',
        yellow:    '#F0B90B',
        tx: {
          primary:   '#EAECEF',
          secondary: '#848E9C',
          muted:     '#5E6673',
        }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], mono: ['JetBrains Mono','Consolas','monospace'] },
    },
  },
  plugins: [],
}
