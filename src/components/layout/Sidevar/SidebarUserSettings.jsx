import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaHistory,
  FaPlusCircle
} from 'react-icons/fa';
import './Sidevar.css';

function SidebarUserSettings() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 60 && !isOpen) {
        setIsOpen(true);
      } else if (e.clientX > 230 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        aria-label="Toggle sidebar"
      >
        {isOpen ? '←' : '→'}
      </button>

      <aside
        className={`sidebar p-3 d-flex flex-column ${isOpen ? 'open' : 'closed'}`}
      >
        <div
          className="d-flex flex-column justify-content-center flex-grow-1"
          style={{ position: 'relative', top: '-40px' }}
        >
          <ul className="list-unstyled mt-3">
            <li>
              <Link to="/usersettings/UserInformation" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaUser className="me-2" />Información de mi usuario
              </Link>
            </li>
            <li>
              <Link to="/usersettings/DonationHistory" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaHistory className="me-2" />Historial de donaciones hechas
              </Link>
            </li>
            <li>
              <Link to="/usersettings/RequestToRegisterAnInstitution" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaPlusCircle className="me-2" />Solicitud para registrar mi institución
                {/* Aquí aparece el formulario si la persona logeada no tiene institución */}
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SidebarUserSettings;
