import React from 'react'
import './AuthPage.css'
import { Outlet } from 'react-router-dom'

//Exportación de tipo Named
export const AuthPage = () => {
  return (

    <div className='auth-container'>
      <br />
      <br />
      <Outlet/>
    </div>
  )
}