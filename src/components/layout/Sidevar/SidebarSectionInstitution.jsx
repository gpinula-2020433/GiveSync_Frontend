import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHotel,
  FaDonate,
  FaCog,
} from 'react-icons/fa';
import './Sidevar.css';

function SidebarSectionInstitution() {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 768);
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
              <Link to="/sectioninstitution/MyInstitution"  onClick={() => isMobile && setIsOpen(false)} className="py-2 px-3 rounded d-block hover-sidebar">
                <FaHotel className="me-2" />Mi Institución
              </Link>
            </li>
            <li>
              <Link to="/sectioninstitution/DonationsToMyInstitution"  onClick={() => isMobile && setIsOpen(false)} className="py-2 px-3 rounded d-block hover-sidebar">
                <FaDonate className="me-2" />Donaciones a mi Institución
              </Link>
            </li>
            <li>
              <Link to="/sectioninstitution/ConfigurationOfTheInstitution"  onClick={() => isMobile && setIsOpen(false)} className="py-2 px-3 rounded d-block hover-sidebar">
                <FaCog className="me-2" />Configurar Institución
              </Link>
            </li>
            <li>
              <Link to="/sectioninstitution/ConfigurationPublication"  onClick={() => isMobile && setIsOpen(false)} className="py-2 px-3 rounded d-block hover-sidebar">
                <FaCog className="me-2" />Administrar Publicaciones
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SidebarSectionInstitution;
