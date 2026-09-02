import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { mockApiPlugin } from './vite-plugin-mock-api.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
