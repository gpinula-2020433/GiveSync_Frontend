import React from 'react'
import { Outlet } from 'react-router-dom'
import './AdminPage.css'
import Navbar from '../../components/Layout/navbar/Navbar'
import SidebarAdmin from '../../components/Layout/SidebarAdmin/SidebarAdmin'
import Footer from '../../components/Layout/FooterAdmin/Footer'
 
export const AdminPage = () => {
  return (
    <div className="admin-page-container">
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar />
      <div className="d-flex" style={{ marginTop: '60px' }}>
        <SidebarAdmin />
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
    </div>
  )
}