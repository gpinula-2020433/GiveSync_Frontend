import React, { useState } from 'react'
import { loginRequest } from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useNotificationContext } from './context/NotificationContext'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { fetchNotifications } = useNotificationContext()

  const login = async (userLoggin, password) => {
    setIsLoading(true)
    const userLoginData = {
      userLoggin,
      password
    }

    const response = await loginRequest(userLoginData)
    setIsLoading(false)

    if (response.error) {
      setError(true)

      const errorData = response?.err?.response?.data

      if (errorData?.errors) {
        for (const err of errorData.errors) {
          toast.error(err.msg)
        }
        return
      }

      toast.error(
        errorData?.message ||
        response?.err?.data?.message ||
        'Error general al logear. Intente de nuevo, todo mal...'
      )
      return
    }

    const token = response.data?.token
    const loggedUser = response.data?.loggedUser

    if (!token || !loggedUser) {
      toast.error('Faltan datos en la respuesta del servidor')
      return
    }

    // Guardar datos del login
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(loggedUser))
    //Asi refresca las notiticaciones del usuario
    fetchNotifications()

    setError(false)
    toast.success(response.data?.message || 'Login exitoso')

    // Redirección condicional si hay reserva pendiente
    const pendingReservation = localStorage.getItem('pendingReservation')

    if (pendingReservation) {
      const parsedReservation = JSON.parse(pendingReservation)
      localStorage.removeItem('pendingReservation')
      navigate('/main/reservation', { state: parsedReservation })
    } else {
      navigate('/main/home')
    }
  }

  return {
    login,
    isLoading,
    error,
    setError
  }
}
