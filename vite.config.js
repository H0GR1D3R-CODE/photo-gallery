import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site from /photo-gallery/, so the build needs that prefix
  base: command === 'build' ? '/photo-gallery/' : '/',
  server: {
    port: 5173,
    host: true,
  },
}))
