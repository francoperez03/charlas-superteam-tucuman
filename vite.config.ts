import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Puerto fijo, vecino del lab de offbrand (5180) del que sale el movimiento.
export default defineConfig({ plugins: [react()], server: { port: 5181, strictPort: true } })
