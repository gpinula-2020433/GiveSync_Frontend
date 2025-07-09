import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Layout/navbar/Navbar'
import SidebarUserSettings from '../../components/Layout/Sidevar/SidebarUserSettings'
import Footer from '../../components/Layout/FooterAdmin/Footer'

export const UserSettingsPage = () => {
  return (
    <div className="admin-page-container d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="d-flex flex-grow-1" style={{ marginTop: '60px' }}>
        <SidebarUserSettings />
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
