import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el sitio bajo /nuestro-camino/
export default defineConfig({
  base: '/nuestro-camino/',
  plugins: [react()],
})
