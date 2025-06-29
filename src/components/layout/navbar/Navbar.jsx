import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useEffect, useState } from 'react'
import DefaultUserImage from '../../../assets/DefaultUserImage.jpg'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useAuthenticatedUser'

export function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, isLoading } = useAuthenticatedUser()
  const [isDarkMode, setIsDarkMode] = useState(true); // Estado para el modo oscuro/claro

  // Verifica el tema almacenado y establece el tema inicial
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      setIsDarkMode(currentTheme === 'dark');
      document.body.setAttribute('data-theme', currentTheme);
    } else {
      // Si no hay tema guardado, usamos el valor predeterminado
      document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  // Cambiar el tema y guardar la preferencia en localStorage
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/main/home')
    setIsLoggedIn(false)
  }

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev)
  }

  const imageUrl = user?.imageUser
    ? `/uploads/img/users/${user.imageUser}`
    : DefaultUserImage

  const isAdmin = user?.role === 'ADMIN'

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white px-4 shadow fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand text-white fw-semibold fs-5">
          GyveSync
        </div>
        <div className="d-flex gap-4 align-items-center">
          {/* Botón de cambio de tema */}
          <button
            className="btn btn-light ms-3"
            onClick={toggleTheme}
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
          </button>

          <Link to="/main/home" className="text-light text-decoration-none">
            <i className="fas fa-house"></i> Principal
          </Link>

          {!isLoggedIn && (
            <Link to="/auth/login" className="text-light text-decoration-none">
              <i className="fas fa-right-to-bracket"></i> Iniciar Sesión
            </Link>
          )}

          {isLoggedIn && user && !isLoading && (
            <>
              {user.hasInstitution && (
                <Link to="/sectioninstitution" className="text-light text-decoration-none">
                  <i className="fas fa-hands-helping"></i> Institución
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-light text-decoration-none">
                  <i className="fas fa-tools"></i> Administración
                </Link>
              )}
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
                    <button className="dropdown-item" onClick={() => navigate('/usersettings')}>
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