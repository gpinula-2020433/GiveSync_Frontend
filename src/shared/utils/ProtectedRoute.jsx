import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthenticatedUser } from '../hooks/User/useAuthenticatedUser'
import toast from 'react-hot-toast'

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthenticatedUser()

  if (isLoading) return null

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export const ProtectedRouteAdmin = () => {
  const { user, isLoading } = useAuthenticatedUser()

  if (isLoading) return null

  if (user?.role !== 'ADMIN') {
    toast.error('No tienes acceso a esta sección')
    return <Navigate to="/main/home" replace />
  }

  return <Outlet />
}

export const ProtectedRouteInstitution = () => {
  const { user, isLoading } = useAuthenticatedUser()

  if (isLoading) return null

  if (!user?.hasInstitution) {
    toast.error('No tienes acceso a esta sección')
    return <Navigate to="/main/home" replace />
  }

  return <Outlet />
}
