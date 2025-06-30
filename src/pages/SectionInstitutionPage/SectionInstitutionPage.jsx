import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Layout/navbar/Navbar'
import SidebarSectionInstitution from '../../components/Layout/Sidevar/SidebarSectionInstitution'
import Footer from '../../components/Layout/FooterAdmin/Footer'
 
export const SectionInstitutionPage = () => {
  return (
    <div className="admin-page-container">
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar />
      <div className="d-flex" style={{ marginTop: '60px' }}>
        <SidebarSectionInstitution />
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
    </div>
  )
}