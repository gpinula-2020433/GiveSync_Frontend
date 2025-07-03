import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  getMyNotificationsRequest,
  markNotificationAsReadRequest,
  deleteNotificationRequest
} from '../../../services/api'
import { useSocket } from '../useSocket'
import decodeToken from '../../utils/decodeToken'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  const userId = decoded?.uid

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getMyNotificationsRequest()
      const all = res.notifications || []
      setNotifications(all)
      setUnreadCount(all.filter(n => !n.isRead).length)
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
  }, [token, userId, fetchNotifications])

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
        setUnreadCount(updated.filter(n => !n.isRead).length)
        return updated
      })
    }
  }

  const deleteNotification = async (id) => {
    const res = await deleteNotificationRequest(id)
    if (!res.error) {
      setNotifications(prev => {
        const filtered = prev.filter(n => n._id !== id)
        setUnreadCount(filtered.filter(n => !n.isRead).length)
        return filtered
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        deleteNotification,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
