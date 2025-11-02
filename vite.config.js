import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  envPrefix: 'VITE_', // Only expose env vars prefixed with VITE_ to the client
})

