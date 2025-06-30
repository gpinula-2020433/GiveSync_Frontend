import React, { useState } from 'react'
import './RegisteredUsers.css'
import { useUsers } from '../../../shared/hooks/User/useUsers'
import DefaultUserImage from '../../../assets/DefaultUserImage.jpg'

export const RegisteredUsers = () => {
  const { users, isLoading, total } = useUsers()
  const [selectedRole, setSelectedRole] = useState('ALL')

  const filteredUsers = selectedRole === 'ALL'
    ? users
    : users.filter(user => user.role === selectedRole)

  return (
    <div className="registered-users-container">
      <h2>Usuarios Registrados</h2>

      <div className="role-filter-buttons">
        <button
          className={selectedRole === 'ALL' ? 'active' : ''}
          onClick={() => setSelectedRole('ALL')}
        >
          Todos
        </button>
        <button
          className={selectedRole === 'ADMIN' ? 'active' : ''}
          onClick={() => setSelectedRole('ADMIN')}
        >
          Admin
        </button>
        <button
          className={selectedRole === 'CLIENT' ? 'active' : ''}
          onClick={() => setSelectedRole('CLIENT')}
        >
          Cliente
        </button>
      </div>

      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No hay usuarios con ese rol.</p>
      ) : (
        <>
          <p>Total mostrados: {filteredUsers.length} / {total}</p>
          <div className="user-list">
            {filteredUsers.map(user => (
              <div className="user-card" key={user._id}>
                <img
                  src={
                    user.imageUser
                      ? `/uploads/img/users/${user.imageUser}`
                      : DefaultUserImage
                  }
                  alt="user"
                  className="user-card-img"
                  onError={(e) => { e.currentTarget.src = DefaultUserImage }}
                />
                <div className="user-info">
                  <p><strong>Nombre:</strong> {user.name} {user.surname}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Rol:</strong> {user.role}</p>
                  <p><strong>¿Tiene institución?</strong> {user.hasInstitution ? 'Sí posee una institución' : 'No posee una institución'}</p>
                  <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                  <p><strong>Actualizado:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
