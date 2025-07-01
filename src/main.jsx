import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 👉 Importa el provider
import { NotificationProvider } from './shared/hooks/context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NotificationProvider> {/* ✅ Envolvemos la app */}
      <App />
    </NotificationProvider>
  </BrowserRouter>
)
