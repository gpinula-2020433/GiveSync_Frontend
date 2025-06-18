import React from 'react'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useUser'
import imgProfile from '../../../assets/logo.png'
import './UserInformation.css'

export const UserInformation = () => {
  const { user, isLoading, error } = useAuthenticatedUser()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="user-container">
      {/* Imagen y acciones */}
      <div className="user-image-box">
        <img
          src={user.imageUser ? `/uploads/img/users/${user.imageUser}` : imgProfile}
          alt="Perfil"
          className="user-profile-img"
          onError={(e) => {
            e.currentTarget.src = imgProfile
          }}
        />
        <div className="user-image-actions">
          <button className="image-action-btn">Actualizar imagen</button>
          <button className="image-action-btn delete">Eliminar imagen</button>
        </div>
      </div>

      {/* Datos */}
      <h2>{user.name} {user.surname}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.hasInstitution && (
        <p className="institution-text">Tienes una institución asociada.</p>
      )}

      {/* Opciones generales */}
      <div className="user-options">
        <button className="user-btn">Actualizar cuenta</button>
        <button className="user-btn delete">Eliminar cuenta</button>
      </div>
    </div>
  )
}
