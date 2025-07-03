import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHotel,
  FaUsers,
  FaDonate,
  FaClipboardList,
} from 'react-icons/fa';
import './Sidevar.css';

function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (e.clientX < 60 && !isOpen) {
        setIsOpen(true);
      } else if (e.clientX > 230 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen, isMobile]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        aria-label="Toggle sidebar"
      >
        {isOpen ? '←' : '→'}
      </button>

      <aside className={`sidebar p-3 d-flex flex-column ${isOpen ? 'open' : 'closed'}`}>
        <div className="d-flex flex-column justify-content-center flex-grow-1" style={{ position: 'relative', top: '-40px' }}>
          <ul className="list-unstyled mt-3">
            <li>
              <Link to="/admin/ListOfInstitutions" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaHotel className="me-2" />Instituciones
              </Link>
            </li>
            <li>
              <Link to="/admin/RequestFromInstitutions" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaClipboardList className="me-2" />Solicitudes de Instituciones
              </Link>
            </li>
            <li>
              <Link to="/admin/AllDonationsMade" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaDonate className="me-2" />Donaciones
              </Link>
            </li>
            <li>
              <Link to="/admin/RegisteredUsers" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaUsers className="me-2" />Usuarios
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;
