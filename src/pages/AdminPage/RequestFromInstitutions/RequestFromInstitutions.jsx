import React, { useEffect, useState } from 'react'
import './RequestFromInstitutions.css'
import { CheckCircle, XCircle, Info, Tag, UserCheck, User, Mail, AlertCircle } from 'lucide-react'

export const RequestFromInstitutions = () => {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3200/v1/institution/pending', {
        headers: { Authorization: token }
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes('no pending')) {
          setInstitutions([])
          setError('')
        } else {
          throw new Error(data.message || 'Error al obtener instituciones')
        }
      } else {
        setInstitutions(data.institutions || [])
        setError('')
      }
    } catch (err) {
      setError(err.message)
      setInstitutions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const updateState = async (id, newState) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3200/v1/institution/updateState/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ state: newState })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al actualizar estado')

      setInstitutions(prev => prev.filter(inst => inst._id !== id))
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  if (loading) return <p className="rfi-status-text">Cargando solicitudes...</p>
  if (error) return <p className="rfi-status-text rfi-error-text">Error: {error}</p>
  if (!error && institutions.length === 0)
    return <p className="rfi-status-text rfi-no-requests-message">No tiene solicitudes de instituciones pendientes.</p>

  return (
    <div className="rfi-container">
      <h2 className="rfi-title">Solicitudes de Instituciones Pendientes</h2>
      <ul className="rfi-institution-list">
        {institutions.map(inst => (
          <li
            key={inst._id}
            className="rfi-institution-card"
            tabIndex={0}
            aria-label={`Solicitud de institución ${inst.name}`}
          >
            <h3 className="rfi-inst-name">
              <Info size={20} /> {inst.name}
            </h3>

            <p className="rfi-inst-type">
              <Tag size={18} /> Tipo: {inst.type?.toUpperCase() || 'N/A'}
            </p>

            <p className="rfi-inst-description">
              <Info size={18} /> Descripción: {inst.description || 'Sin descripción'}
            </p>

            <p className="rfi-inst-state">
              <AlertCircle size={18} /> Estado: {inst.state || 'No disponible'}
            </p>

            <p className="rfi-inst-createdAt">
              <Info size={18} /> Creado: {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : 'No disponible'}
            </p>

            <div className="rfi-user-info">
              <UserCheck size={18} />
              <strong>Usuario que solicita:</strong>
              <p className="rfi-user-fullname">{`${inst.userId?.name || 'Desconocido'} ${inst.userId?.surname || ''}`.trim()}</p>
              <p className="rfi-user-username">
                <User size={14} /> {inst.userId?.username || 'No disponible'}
              </p>
              <p className="rfi-user-email">
                <Mail size={14} /> {inst.userId?.email || 'Correo no disponible'}
              </p>
            </div>

            <div className="rfi-buttons">
              <button
                onClick={() => updateState(inst._id, 'ACCEPTED')}
                className="rfi-accept-btn"
                aria-label={`Aceptar solicitud de ${inst.name}`}
              >
                <CheckCircle size={18} /> Aceptar
              </button>
              <button
                onClick={() => updateState(inst._id, 'REFUSED')}
                className="rfi-reject-btn"
                aria-label={`Rechazar solicitud de ${inst.name}`}
              >
                <XCircle size={18} /> Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
