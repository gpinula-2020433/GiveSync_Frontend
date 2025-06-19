import React, { useRef, useState } from 'react'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useUser'
import imgProfile from '../../../assets/logo.png'
import './UserInformation.css'

export const UserInformation = () => {
  const {
    user,
    isLoading,
    error,
    message,
    updateUserImage,
    deleteUserImage
  } = useAuthenticatedUser()

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const inputFileRef = useRef()

  const handleOpenUpdate = () => {
    setSelectedFile(null)
    setShowUpdateModal(true)
  }

  const handleSubmitImage = () => {
    if (selectedFile) {
      updateUserImage(selectedFile)
      setShowUpdateModal(false)
    }
  }

  const handleOpenDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    deleteUserImage()
    setShowDeleteModal(false)
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="user-container">
      <div className="user-image-box">
        <img
          src={user.imageUser ? `http://localhost:3200/uploads/img/users/${user.imageUser}` : imgProfile}
          alt="Perfil"
          className="user-profile-img"
          onError={(e) => { e.currentTarget.src = imgProfile }}
        />
        <div className="user-image-actions">
          <button className="image-action-btn" onClick={handleOpenUpdate}>Actualizar imagen</button>
          <button className="image-action-btn delete" onClick={handleOpenDelete}>Eliminar imagen</button>
        </div>
      </div>

      <h2>{user.name} {user.surname}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.hasInstitution && (
        <p className="institution-text">Tienes una institución asociada.</p>
      )}

      {message && <p className="success-message">{message}</p>}

      <div className="user-options">
        <button className="user-btn">Actualizar cuenta</button>
        <button className="user-btn delete">Eliminar cuenta</button>
      </div>

      {/* Modal Actualizar Imagen */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Actualizar Imagen</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className="modal-actions">
              <button onClick={handleSubmitImage}>Aceptar</button>
              <button className="delete" onClick={() => setShowUpdateModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>¿Seguro que quieres eliminar la imagen de perfil?</h3>
            <div className="modal-actions">
              <button onClick={handleConfirmDelete}>Sí, eliminar</button>
              <button className="delete" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
