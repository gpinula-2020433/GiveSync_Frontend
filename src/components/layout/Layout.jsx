// src/components/common/Layout.jsx
import React from 'react';

import './layout.css'
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children} {/* Aquí se carga dinámicamente la página */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
