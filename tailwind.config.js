/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['"Kanit"', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        geist: ['"Geist"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#0C0C0C',
        graphite: '#151517',
        platinum: '#D7E2EA',
      },
    },
  },
  plugins: [],
};
