import React, { useEffect, useState } from 'react'
import './DonationsToMyInstitution.css'
import { FaUser, FaCalendarAlt, FaHandHoldingUsd, FaBuilding, FaTags, FaInfoCircle } from 'react-icons/fa'

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

  if (loading) return <p className="institution-loading">Cargando donaciones...</p>
  if (error) return <p className="institution-error">Error: {error}</p>
  if (donations.length === 0) return <p className="institution-empty">No hay donaciones para tu institución.</p>

  return (
    <div className="institution-donations-container">
      <h2 className="institution-title">Donaciones a Mi Institución</h2>
      <ul className="institution-donation-list">
        {donations.map((donation) => (
          <li key={donation._id} className="institution-donation-card">
            <p><FaHandHoldingUsd className="icon" /> <strong>Monto:</strong> Q{donation.amount?.toFixed(2)}</p>
            <p><FaCalendarAlt className="icon" /> <strong>Fecha:</strong> {new Date(donation.createdAt).toLocaleDateString()}</p>
            <p><FaUser className="icon" /> <strong>Usuario:</strong> {donation.user?.name || 'Desconocido'}</p>
            <hr />
            <p><FaBuilding className="icon" /> <strong>Institución:</strong> {donation.institution?.name || 'Desconocida'}</p>
            <p><FaTags className="icon" /> <strong>Tipo:</strong> {donation.institution?.type || 'N/A'}</p>
            <p><FaInfoCircle className="icon" /> <strong>Descripción:</strong> {donation.institution?.description || 'Sin descripción'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
