import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Puerto fijo, vecino del lab de offbrand (5180) del que sale el movimiento.
// VITE_BASE lo pone el workflow de GitHub Pages; en Vercel y local queda '/'.
export default defineConfig({ base: process.env.VITE_BASE ?? '/', plugins: [react()], server: { port: 5181, strictPort: true } })
