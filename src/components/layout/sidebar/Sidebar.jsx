import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHotel,
  FaBed,
  FaConciergeBell,
  FaCalendarAlt,
  FaChartBar
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
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
        className={`sidebar bg-secondary text-light p-3 d-flex flex-column ${
          isOpen ? 'open' : 'closed'
        }`}
      >
        <div
          className="d-flex flex-column justify-content-center flex-grow-1"
          style={{ position: 'relative', top: '-40px' }}
        >
          <ul className="list-unstyled mt-3">
            <li>
              <Link to="/admin/hotel" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaHotel className="me-2" /> Hotel
              </Link>
            </li>
            <li>
              <Link to="/admin/room" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaBed className="me-2" /> Room
              </Link>
            </li>
            <li>
              <Link to="/admin/services" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaConciergeBell className="me-2" /> Services
              </Link>
            </li>
            <li>
              <Link to="/admin/event" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaCalendarAlt className="me-2" /> Events
              </Link>
            </li>
            <li>
              <Link to="/admin/report" className="py-2 px-3 rounded d-block hover-sidebar">
                <FaChartBar className="me-2" /> Reports
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
