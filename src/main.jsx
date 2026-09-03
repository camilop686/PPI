// Punto de entrada: prepara React y monta la aplicación en el HTML principal.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Importa el componente raíz que contiene las rutas y funcionalidades.
import App from './App.jsx'

// StrictMode ayuda a detectar efectos secundarios durante el desarrollo.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
