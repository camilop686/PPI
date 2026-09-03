import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configura Vite para transformar JSX mediante el plugin oficial de React.
export default defineConfig({
  plugins: [react()],
})
