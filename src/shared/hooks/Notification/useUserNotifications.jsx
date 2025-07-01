import { useEffect, useState, useCallback } from 'react'
import { getMyNotificationsRequest } from '../../../services/api'
import toast from 'react-hot-toast'
import { useSocket } from '../useSocket'
import decodeToken from '../../utils/decodeToken'

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Decodificar token y extraer uid
  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  const userId = decoded?.uid

  const fetchNotifications = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (token && userId) {
      fetchNotifications()
    } else {
      setIsLoading(false)
    }
  }, [userId, token, fetchNotifications])

  // Escuchar notificaciones nuevas por socket
  useSocket('addNotification', ({ notification }) => {
  if (notification?.userId === userId) {
    setNotifications(prev => [notification, ...prev])
  }
})


  return { notifications, isLoading }
}
