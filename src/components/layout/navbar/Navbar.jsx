import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useEffect, useState } from 'react'
import DefaultUserImage from '../../../assets/DefaultUserImage.jpg'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useAuthenticatedUser'
import { useNotificationContext } from '../../../shared/hooks/context/NotificationContext'
import logo from '../../../assets/logo.png'

export function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, isLoading } = useAuthenticatedUser()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { unreadCount } = useNotificationContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      setIsDarkMode(currentTheme === 'dark')
      document.documentElement.setAttribute('data-theme', currentTheme)
    } else {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    const newTheme = isDarkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }, [isDarkMode])

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/main/home')
    setIsLoggedIn(false)
    setIsMenuOpen(false)
  }

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev)
  }

  const toggleMenu = (e) => {
  e.preventDefault()
  setIsMenuOpen(prev => !prev)
  if (showDropdown) setShowDropdown(false)
}


  const imageUrl = user?.imageUser
    ? `/uploads/img/users/${user.imageUser}`
    : DefaultUserImage

  const isAdmin = user?.role === 'ADMIN'

  // Cerrar menú al navegar
  const handleNavigate = (path) => {
    navigate(path)
    setIsMenuOpen(false)
    setShowDropdown(false)
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white px-4 shadow fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" className="navbar-logo" />
          <span className="brand-text">GiveSync</span>
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          type="button" 
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`menu-items d-flex align-items-center gap-4 ${isMenuOpen ? 'open' : ''}`}>
          {/* Botón cambio de tema */}
          <button
            className="btn btn-light ms-3 theme-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
          </button>

          <Link to="/main/home" className="text-light text-decoration-none" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-house"></i> Principal
          </Link>

          {!isLoggedIn && (
            <Link to="/auth/login" className="text-light text-decoration-none" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-right-to-bracket"></i> Iniciar Sesión
            </Link>
          )}

          {isLoggedIn && user && !isLoading && (
            <>
              {user.hasInstitution && (
                <Link to="/sectioninstitution" className="text-light text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-hands-helping"></i> Institución
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-light text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-tools"></i> Administración
                </Link>
              )}
                <Link
                  to="/main/myNotifications"
                  className="text-light text-decoration-none position-relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-bell me-2"></i> Notificaciones
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
              <div className="profile-container position-relative">
                <img
                  src={imageUrl}
                  alt="profile"
                  className="profile-img"
                  onClick={toggleDropdown}
                  onError={(e) => {
                    e.currentTarget.src = DefaultUserImage
                  }}
                />
                {showDropdown && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={() => handleNavigate('/usersettings')}>
                      <i className="fas fa-cog me-2"></i>
                      <span>Configuración</span>
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
