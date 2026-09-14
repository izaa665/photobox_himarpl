/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
        terminal: ['"VT323"', 'monospace'],
      },
      colors: {
        arcade: {
          bg: '#0d001a',
          grid: '#2d0a4e',
          neonPink: '#ff007f',
          neonCyan: '#00f0ff',
        }
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ff007f, 0 0 20px #ff007f, 0 0 30px #ff007f',
        'neon-cyan': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
      }
    },
  },
  plugins: [],
}
