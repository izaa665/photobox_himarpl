import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/save_photos.php': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/get_photos.php': {
        target: 'http://localhost',
        changeOrigin: true,
      }
    }
  }
})
