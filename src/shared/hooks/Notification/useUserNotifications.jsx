import { useEffect, useState } from 'react'
import { getMyNotificationsRequest } from '../../../services/api'
import toast from 'react-hot-toast'

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchNotifications()
    } else {
      setIsLoading(false) // No hay token, no tiene sentido mostrar loading
    }
  }, [])

  const fetchNotifications = async () => {
  try {
    setIsLoading(true)
    const res = await getMyNotificationsRequest()
    if (!res.error) {
      setNotifications(res.notifications || [])
    } else {
      if (res.errors) {
        res.errors.forEach(err => toast.error(err.msg))
      } else {
        toast.error(res.message || 'Error al obtener notificaciones')
      }
      setNotifications([])
    }
  } catch (err) {
    toast.error('Error al obtener notificaciones')
  } finally {
    setIsLoading(false)
  }
}


  return { notifications, isLoading }
}
