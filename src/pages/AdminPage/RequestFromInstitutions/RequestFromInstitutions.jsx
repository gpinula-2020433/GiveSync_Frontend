import React, { useEffect, useState } from 'react'
import './RequestFromInstitutions.css'
import { CheckCircle, XCircle } from 'lucide-react'

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

  if (loading) return <p className="status-text">Cargando solicitudes...</p>
  if (error) return <p className="status-text error-text">Error: {error}</p>
  if (!error && institutions.length === 0) return <p className="status-text no-requests-message">No tiene solicitudes de instituciones pendientes.</p>

  return (
    <div className="request-institutions-container">
      <h2 className="request-title">Solicitudes de Instituciones Pendientes</h2>
      <ul className="institution-list">
        {institutions.map(inst => (
          <li key={inst._id} className="institution-card">
            <h3>{inst.name}</h3>
            <p><strong>Tipo:</strong> {inst.type}</p>
            <p><strong>Descripción:</strong> {inst.description}</p>
            <div className="buttons">
              <button onClick={() => updateState(inst._id, 'ACCEPTED')} className="accept-btn">
                <CheckCircle size={18} /> Aceptar
              </button>
              <button onClick={() => updateState(inst._id, 'REFUSED')} className="reject-btn">
                <XCircle size={18} /> Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
