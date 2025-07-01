import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../shared/hooks/User/useUser'
import DefaultUserImage from '../../../assets/DefaultUserImage.jpg'
import './UserInformation.css'
import toast from 'react-hot-toast'

export const UserInformation = () => {
  const navigate = useNavigate()

  const {
    user,
    isLoading,
    error,
    message,
    updateUserImage,
    deleteUserImage,
    updateUser,
    deleteUserAccount
  } = useUser()
const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUpdateDataModal, setShowUpdateDataModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [passwordToDelete, setPasswordToDelete] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: ''
  })

  const inputFileRef = useRef()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/main/home')
  }

  const handleOpenUpdateData = () => {
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      username: user.username || ''
    })
    setShowUpdateDataModal(true)
  }

  const handleSubmitData = () => {
    const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== user[key]) {
        acc[key] = value
      }
      return acc
    }, {})

    if (Object.keys(updatedFields).length === 0) {
      toast.error('No hay cambios para actualizar')
      return
    }

    updateUser(updatedFields)
    setShowUpdateDataModal(false)
  }

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

  const handleConfirmAccountDelete = async () => {
    if (!passwordToDelete.trim()) {
      toast.error('Ingresa tu contraseña para continuar')
      return
    }

    setIsDeleting(true)
    const res = await deleteUserAccount(passwordToDelete)
    setIsDeleting(false)

    if (res.success) {
      handleLogout()
    }
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="user-container">
      <div className="user-image-box">
        <img
          src={user.imageUser ? `http://localhost:3200/uploads/img/users/${user.imageUser}` : DefaultUserImage}
          alt="Perfil"
          className="user-profile-img"
          onError={(e) => { e.currentTarget.src = DefaultUserImage }}
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
        <button className="user-btn" onClick={handleOpenUpdateData}>Actualizar cuenta</button>
            <button className="user-btn delete" onClick={() => setShowConfirmDeleteModal(true)}>Eliminar cuenta</button>
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

      {/* Modal Confirmar Eliminación Imagen */}
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

      {/* Modal Actualizar Datos Usuario */}
      {showUpdateDataModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Actualizar Datos de Usuario</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitData()
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Apellido:
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Actualizar</button>
                <button
                  type="button"
                  className="delete"
                  onClick={() => setShowUpdateDataModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Simple antes de eliminar cuenta */}
{showConfirmDeleteModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>¿Seguro que quieres eliminar tu cuenta?</h3>
      <div className="modal-actions">
        <button
          onClick={() => {
            setShowConfirmDeleteModal(false)
            setShowDeleteAccountModal(true)
          }}
        >
          Sí
        </button>
        <button
          className="delete"
          onClick={() => setShowConfirmDeleteModal(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal Eliminar Cuenta */}
      {showDeleteAccountModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>¿Estás seguro de que deseas eliminar tu cuenta?</h3>
            <p>Esta acción no se puede deshacer. Ingresa tu contraseña para confirmar:</p>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwordToDelete}
              onChange={(e) => setPasswordToDelete(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleConfirmAccountDelete} disabled={isDeleting}>
                {isDeleting ? 'Eliminando...' : 'Confirmar'}
              </button>
              <button
                className="delete"
                onClick={() => {
                  setShowDeleteAccountModal(false)
                  setPasswordToDelete('')
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
