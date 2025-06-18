import React from 'react'
import { AuthPage } from './pages/Auth/AuthPage'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { Navigate } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import HomePage from './pages/MainPage/HomePage/HomePage'
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";
import WelcomePage from './pages/MainPage/WelcomePage/WelcomePage'
import {AdminPage} from '../src/pages/AdminPage/AdminPage'
import {SectionInstitutionPage} from '../src/pages/SectionInstitutionPage/SectionInstitutionPage'
import {UserSettingsPage} from '../src/pages/UserSettingsPage/UserSettingsPage'

import {AllDonationsMade} from '../src/pages/AdminPage/AllDonationsMade/AllDonationsMade'
import {ListOfInstitutions} from '../src/pages/AdminPage/ListOfInstitutions/ListOfInstitutions'
import {PanelGeneralInformation} from '../src/pages/AdminPage/PanelGeneralInformation/PanelGeneralInformation'
import {RegisteredUsers} from '../src/pages/AdminPage/RegisteredUsers/RegisteredUsers'
import {RequestFromInstitutions} from '../src/pages/AdminPage/RequestFromInstitutions/RequestFromInstitutions'

import {ConfigurationOfTheInstitution} from '../src/pages/SectionInstitutionPage/ConfigurationOfTheInstitution/ConfigurationOfTheInstitution'
import {DonationsToMyInstitution} from '../src/pages/SectionInstitutionPage/DonationsToMyInstitution/DonationsToMyInstitution'
import {MyInstitution} from '../src/pages/SectionInstitutionPage/MyInstitution/MyInstitution'

import {DonationHistory} from '../src/pages/UserSettingsPage/DonationHistory/DonationHistory'
import {RequestToRegisterAnInstitution} from '../src/pages/UserSettingsPage/RequestToRegisterAnInstitution/RequestToRegisterAnInstitution'
import {UserInformation} from '../src/pages/UserSettingsPage/UserInformation/UserInformation'
import InstitutionDetail from './pages/MainPage/DetailsInstitutionPage/InstitutionDetail'
import {CommentsPage}  from './pages/CommentsPage/CommentsPage'
import { element } from 'prop-types'
import ConfigurationPublication from './pages/SectionInstitutionPage/configurationPublication/ConfigurationPublication'

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
    { path: 'home', element: <HomePage /> },
    { path: 'institution/:id', element: <InstitutionDetail /> },
    { path: 'publication/:publicationId', element: <CommentsPage /> } // <-- Aquí
  ]
},
  {
    path: '/admin',
    element: <AdminPage />,
    children: [
      { path: 'AllDonationsMade', element: <AllDonationsMade/>},
      { path: 'ListOfInstitutions', element: <ListOfInstitutions/>},
      { path: 'PanelGeneralInformation', element: <PanelGeneralInformation/>},
      { path: 'RegisteredUsers', element: <RegisteredUsers/>},
      { path: 'RequestFromInstitutions', element: <RequestFromInstitutions/>}
    ]
  },
  {
    path: '/sectioninstitution',
    element: <SectionInstitutionPage/>,
    children: [
      { path: 'ConfigurationOfTheInstitution', element: <ConfigurationOfTheInstitution/>},
      { path: 'DonationsToMyInstitution', element: <DonationsToMyInstitution/>},
      { path: 'MyInstitution', element: <MyInstitution/>},
      { path: 'ConfigurationPublication', element: <ConfigurationPublication/>}
    ]
  },
  {
    path: '/usersettings',
    element: <UserSettingsPage/>,
    children: [
      { path: 'DonationHistory', element: <DonationHistory/>},
      { path: 'RequestToRegisterAnInstitution', element: <RequestToRegisterAnInstitution/>},
      { path: 'UserInformation', element: <UserInformation/>}
    ]
  },
  {
    path:'*',
    element: <NotFoundPage/>
  }
]