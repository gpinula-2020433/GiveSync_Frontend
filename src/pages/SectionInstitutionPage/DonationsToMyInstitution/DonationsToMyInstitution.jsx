import React, { useEffect, useState } from 'react'
import './DonationsToMyInstitution.css'

export const DonationsToMyInstitution = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3200/v1/donation/institution/my', {
        headers: {
          Authorization: token,
        },
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Error al obtener donaciones')

      setDonations(data.donations || []);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDonations()
  }, [])

  if (loading) return <p className="loading-text">Cargando donaciones...</p>
  if (error) return <p className="error-text">Error: {error}</p>
  if (donations.length === 0) return <p className="no-donations-text">No hay donaciones para tu institución.</p>

  return (
    <div className="donations-container">
      <h2>Donaciones a Mi Institución</h2>
      <ul className="donations-list">
        {donations.map((donation) => (
          <li key={donation._id} className="donation-card">
            <p><strong>Monto:</strong> ${donation.monto.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {new Date(donation.fecha).toLocaleDateString()}</p>
            <p><strong>Usuario:</strong> {donation.userId?.name || 'Desconocido'}</p>
            <p><strong>Institución:</strong> {donation.institutionId?.name || 'Desconocida'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
