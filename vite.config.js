import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // УБРАТЬ base ИЛИ ОСТАВИТЬ ПУСТЫМ
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})