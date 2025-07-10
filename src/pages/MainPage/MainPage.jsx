// src/pages/Main/MainPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from '../../components/layout/navbar/Navbar';
import Footer from '../../components/layout/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  return (
    <div className="main-page-container">
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="flex-grow-1" style={{ marginTop: '60px', minHeight: '80vh' }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
