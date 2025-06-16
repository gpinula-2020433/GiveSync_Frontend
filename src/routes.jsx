import React from 'react'
import { AuthPage } from './pages/Auth/AuthPage'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { Navigate } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import HomePage from './pages/HomePage/HomePage'
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";
import WelcomePage from './pages/WelcomePage/WelcomePage'
import {AdminPage} from '../src/pages/AdminPage/AdminPage'
import {SectionInstitutionPage} from '../src/pages/SectionInstitutionPage/SectionInstitutionPage'
import {UserSettingsPage} from '../src/pages/UserSettingsPage/UserSettingsPage'

export const routes = [
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    children: [
      { path: '', element: <Navigate to="login" /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  },
  {
    path: '/main',
    element: <MainPage />,
    children: [
      { path: 'home', element: <HomePage/>}
    ]
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/sectioninstitution',
    element: <SectionInstitutionPage/>
  },
  {
    path: '/usersettings',
    element: <UserSettingsPage/>
  },
  {
    path:'*',
    element: <NotFoundPage/>
  }
]