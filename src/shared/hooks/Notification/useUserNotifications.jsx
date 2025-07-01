import { useEffect, useState, useCallback } from 'react'
import { getMyNotificationsRequest, markNotificationAsReadRequest, deleteNotificationRequest } from '../../../services/api'
import toast from 'react-hot-toast'
import { useSocket } from '../useSocket'
import decodeToken from '../../utils/decodeToken'

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  const userId = decoded?.uid

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getMyNotificationsRequest()
      if (!res.error) {
        const all = res.notifications || []
        setNotifications(all)
        setUnreadCount(all.filter(n => !n.isRead).length)
      } else {
        toast.error(res.message || 'Error al obtener notificaciones')
        setNotifications([])
        setUnreadCount(0)
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

  // Nueva notificación por socket
  useSocket('addNotification', ({ notification }) => {
    if (notification?.userId === userId) {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    }
  })

  const markAsRead = async (id) => {
  const res = await markNotificationAsReadRequest(id)
  if (!res.error) {
    setNotifications(prev => {
      const updated = prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      // 🧠 Recalcula cuántas quedan sin leer
      const unread = updated.filter(n => !n.isRead).length
      setUnreadCount(unread)
      return updated
    })
  }
}


  const deleteNotification = async (id) => {
  const res = await deleteNotificationRequest(id)
  if (!res.error) {
    setNotifications(prev => {
      const filtered = prev.filter(n => n._id !== id)
      // 🧠 Recalcula cuántas quedan sin leer
      const unread = filtered.filter(n => !n.isRead).length
      setUnreadCount(unread)
      return filtered
    })
  }
}

  return {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    isLoading,
    markAsRead,
    deleteNotification
  }
}
