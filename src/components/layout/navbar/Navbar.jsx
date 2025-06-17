import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import decodeToken from '../../../shared/utils/decodeToken';
import { useEffect, useState } from 'react';
import imgProfile from '../../../assets/logo.png';

export function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userImage, setUserImage] = useState(imgProfile);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      setIsLoggedIn(true);
      setIsAdmin(decoded?.role === 'ADMIN');

      const imageUrl = decoded?.imageUser
        ? `/uploads/img/users/${decoded.imageUser}`
        : imgProfile;

      setUserImage(imageUrl);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserImage(imgProfile); // fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserImage(imgProfile);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white px-4 shadow fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand text-white fw-semibold fs-5">
          GyveSync
        </div>
        <div className="d-flex gap-4 align-items-center">
          <Link to="/main/home" className="text-light text-decoration-none">
            <i className="fas fa-house"></i> Principal
          </Link>

          {!isLoggedIn && (
            <Link to="/auth/login" className="text-light text-decoration-none">
              <i className="fas fa-right-to-bracket"></i> Iniciar Sesión
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/sectioninstitution" className="text-light text-decoration-none">
                <i className="fas fa-hands-helping"></i> Institución
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-light text-decoration-none">
                  <i className="fas fa-tools"></i> Administración
                </Link>
              )}
              <div className="profile-container position-relative">
                <img
                  src={userImage}
                  alt="profile"
                  className="profile-img"
                  onClick={toggleDropdown}
                  onError={(e) => {
                    e.currentTarget.src = imgProfile
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
  );
}

export default Navbar;