import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 👉 Importa el provider
import { NotificationProvider } from './shared/hooks/context/NotificationContext.jsx'
import { AuthenticatedUserProvider } from './shared/hooks/User/useAuthenticatedUser.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthenticatedUserProvider> {/* ✅ Nuevo provider agregado */}
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthenticatedUserProvider>
  </BrowserRouter>
)