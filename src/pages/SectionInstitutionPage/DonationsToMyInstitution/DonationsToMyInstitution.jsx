import React, { useEffect, useState } from 'react'
import './DonationsToMyInstitution.css'

export const DonationsToMyInstitution = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3200/v1/donation/institution/my', {
        headers: {
          Authorization: token,
        },
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Error al obtener donaciones')

      setDonations(data.donations || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  if (loading) return <p className="loading-message">Cargando donaciones...</p>
  if (error) return <p className="error-message">Error: {error}</p>
  if (donations.length === 0) return <p className="empty-message">No hay donaciones para tu institución.</p>

  return (
    <div className="donations-container">
      <h2 className="title">Donaciones a Mi Institución</h2>
      <ul className="donation-list">
        {donations.map((donation) => (
          <li key={donation._id} className="donation-card">
            <p className="icon-amount"><strong>Monto:</strong> ${donation.amount?.toFixed(2)}</p>
            <p className="icon-date"><strong>Fecha:</strong> {new Date(donation.createdAt).toLocaleDateString()}</p>
            <p className="icon-user"><strong>Usuario:</strong> {donation.user?.name || 'Desconocido'}</p>

            <hr />

            <p className="icon-institution-amount"><strong>Institución:</strong> {donation.institution?.name || 'Desconocida'}</p>
            <p><strong>Tipo:</strong> {donation.institution?.type || 'N/A'}</p>
            <p><strong>Descripción:</strong> {donation.institution?.description || 'Sin descripción'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
