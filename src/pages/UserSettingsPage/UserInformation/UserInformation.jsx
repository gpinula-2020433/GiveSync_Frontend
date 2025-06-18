import React from 'react'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useUser'
import imgProfile from '../../../assets/logo.png'

export const UserInformation = () => {
  const { user, isLoading, error } = useAuthenticatedUser()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
      {/* Contenedor de la imagen y acciones */}
      <div style={{
        backgroundColor: '#3498db',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <img
          src={
            user.imageUser
              ? `/uploads/img/users/${user.imageUser}`
              : imgProfile
          }
          alt="Perfil"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '8px',
            objectFit: 'cover',
            border: '3px solid white',
            marginBottom: '1rem'
          }}
          onError={(e) => {
            e.currentTarget.src = imgProfile
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            style={{
              backgroundColor: 'white',
              color: '#3498db',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Actualizar imagen
          </button>
          <button
            style={{
              backgroundColor: 'white',
              color: '#e74c3c',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Eliminar imagen
          </button>
        </div>
      </div>

      {/* Datos del usuario */}
      <h2>{user.name} {user.surname}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.hasInstitution && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Tienes una institución asociada.</p>
      )}

      {/* Botones de cuenta */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button style={{ padding: '0.5rem 1rem' }}>Actualizar cuenta</button>
        <button style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white' }}>
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}
