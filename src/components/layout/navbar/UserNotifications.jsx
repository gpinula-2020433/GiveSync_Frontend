import React from 'react'
import './UserNotifications.css'
import { useUserNotifications } from '../../../shared/hooks/Notification/useUserNotifications'

export const UserNotifications = () => {
  const { notifications, isLoading } = useUserNotifications()

  return (
    <div className="notifications-container">
      <h2>Mis Notificaciones</h2>
      {isLoading ? (
        <p>Cargando notificaciones...</p>
      ) : notifications.length === 0 ? (
        <p>No tienes notificaciones.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li key={notif._id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              <p className="message">{notif.message}</p>
              <div className="meta">
                <span className="from-user">
                  {notif.fromUserId
                    ? `De: ${notif.fromUserId.name} (@${notif.fromUserId.username})`
                    : 'Sistema'}
                </span>
                <span className="timestamp">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
