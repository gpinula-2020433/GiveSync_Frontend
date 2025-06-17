import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import decodeToken from '../../../shared/utils/decodeToken';
import { useEffect, useState } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      setIsLoggedIn(true);
      setIsAdmin(decoded?.role === 'ADMIN');
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white px-4 shadow fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand text-white fw-semibold fs-5">
          GyveSync
        </div>
        <div className="d-flex gap-4">
          <Link to="/main/home" className="text-light text-decoration-none">Principal</Link>

          {!isLoggedIn && (
            <Link to="/auth/login" className="text-light text-decoration-none">Iniciar Sesión</Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/sectioninstitution" className="text-light text-decoration-none">Institucion</Link>
              {isAdmin && (
                <Link to="/admin" className="text-light text-decoration-none">Administración</Link>
              )}
              <Link to="/usersettings" className="text-light text-decoration-none">Configuración Usuario</Link>  
              <Link to="/auth/login" className="text-light text-decoration-none" onClick={handleLogout}>Cerrar sesión</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
