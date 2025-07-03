// ✅ components/Admin/RequestFromInstitutions.jsx
import React from 'react'
import './RequestFromInstitutions.css'
import {
  CheckCircle,
  XCircle,
  Info,
  Tag,
  UserCheck,
  User,
  Mail,
  AlertCircle
} from 'lucide-react'
import DefaultUserImage from '../../../assets/DefaultUserImage.jpg'
import { usePendingInstitutions } from '../../../shared/hooks/donation/usePendingInstitutions'

const translateType = (type) => {
  const map = {
    ORPHANAGE: 'ORFANATO',
    EATERS: 'COMEDOR',
    ACYL: 'ASILO'
  }
  return map[type] || type
}

const translateState = (state) => {
  const map = {
    ACCEPTED: 'ACEPTADO',
    EARRING: 'PENDIENTE',
    REFUSED: 'RECHAZADO'
  }
  return map[state] || state
}


export const RequestFromInstitutions = () => {
  const {
    institutions,
    imageIndexes,
    loading,
    error,
    updateState,
    nextImage,
    prevImage
  } = usePendingInstitutions()

  if (loading) return <p className="rfi-status-text">Cargando solicitudes...</p>
  if (error) return <p className="rfi-status-text rfi-error-text">Error: {error}</p>
  if (!error && institutions.length === 0)
    return <p className="rfi-status-text rfi-no-requests-message">No tiene solicitudes de instituciones pendientes.</p>

  return (
    <div className="rfi-container">
      <h2 className="rfi-title">Solicitudes de Instituciones Pendientes</h2>
      <ul className="rfi-institution-list">
        {institutions.map(inst => {
          const images = inst.imageInstitution || []
          const currentIndex = imageIndexes[inst._id] || 0
          return (
            <li key={inst._id} className="rfi-institution-card">
              <h3 className="rfi-inst-name">
                <Info size={20} /> {inst.name}
              </h3>
              {images.length > 0 ? (
                <div className="rfi-carousel">
                  <img
                    src={`/uploads/img/users/${images[currentIndex]}`}
                    alt={`Imagen ${currentIndex + 1} de ${inst.name}`}
                    className="rfi-carousel-image"
                    draggable={false}
                  />
                  {images.length > 1 && (
                    <>
                      <button className="rfi-carousel-btn left" onClick={() => prevImage(inst._id, images.length)}>‹</button>
                      <button className="rfi-carousel-btn right" onClick={() => nextImage(inst._id, images.length)}>›</button>
                    </>
                  )}
                </div>
              ) : (
                <p className="rfi-no-image-text">El usuario no envió imágenes de su institución</p>
              )}
              <p className="rfi-inst-type">
                <Tag size={18} /> Tipo: {translateType(inst.type) || 'No especificado'}
              </p>
              <p className="rfi-inst-description">
                <Info size={18} /> Descripción: {inst.description || 'Sin descripción'}
              </p>
              <p className="rfi-inst-state">
                <AlertCircle size={18} /> Estado: {translateState(inst.state) || 'No disponible'}
              </p>
              <p className="rfi-inst-createdAt">
                <Info size={18} /> Creado: {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : 'No disponible'}
              </p>
              <div className="rfi-user-info">
                <UserCheck size={18} />
                <strong>Usuario que solicita:</strong>
                <img
                  src={inst.userId?.imageUser ? `/uploads/img/users/${inst.userId.imageUser}` : DefaultUserImage}
                  alt="Imagen del usuario"
                  className="rfi-user-image"
                  onError={(e) => { e.currentTarget.src = DefaultUserImage }}
                />
                <p className="rfi-user-fullname">{`${inst.userId?.name || 'Desconocido'} ${inst.userId?.surname || ''}`.trim()}</p>
                <p className="rfi-user-username">
                  <User size={14} /> {inst.userId?.username || 'No disponible'}
                </p>
                <p className="rfi-user-email">
                  <Mail size={14} /> {inst.userId?.email || 'Correo no disponible'}
                </p>
              </div>
              <div className="rfi-buttons">
                <button onClick={() => updateState(inst._id, 'ACCEPTED')} className="rfi-accept-btn">
                  <CheckCircle size={18} /> Aceptar
                </button>
                <button onClick={() => updateState(inst._id, 'REFUSED')} className="rfi-reject-btn">
                  <XCircle size={18} /> Rechazar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
