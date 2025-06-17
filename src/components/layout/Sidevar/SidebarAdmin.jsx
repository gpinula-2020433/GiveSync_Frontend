import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHotel,
  FaUsers,
  FaDonate,
  FaClipboardList,
  FaChartBar
} from 'react-icons/fa';
import './Sidevar.css';

function SidebarAdmin() {
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
        className={`sidebar bg-secondary text-light p-3 d-flex flex-column ${isOpen ? 'open' : 'closed'}`}
      >
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
            <li>
              <Link to="/admin/PanelGeneralInformation" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaChartBar className="me-2" />Panel
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;