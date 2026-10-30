import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Listen on the local network too, so the terminal prints a "Network:" link
    // that phones and other computers on the same Wi-Fi can open
    host: true,
  },
})
