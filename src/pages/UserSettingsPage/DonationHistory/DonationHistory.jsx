import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './DonationHistory.css'

export const DonationHistory = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1]
      const payload = atob(base64Payload)
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Usuario no autenticado')

        const decoded = parseJwt(token)
        if (!decoded || !decoded.uid) throw new Error('Token inválido')

        const userId = decoded.uid

        const res = await axios.get('http://localhost:3200/v1/donation/', {
          headers: { Authorization: token }
        })

        if (res.data.success) {
          const userDonations = res.data.donations.filter(donation => {
            const donationUserId = donation.user?._id || ''
            return donationUserId.toString().toLowerCase() === userId.toString().toLowerCase()
          })

          setDonations(userDonations)
        } else {
          setError('No se pudo obtener las donaciones')
        }
      } catch (err) {
        setError(err.message || 'Error al cargar las donaciones')
      }
      setLoading(false)
    }

    fetchDonations()
  }, [])

  if (loading) return <p>Cargando historial de donaciones...</p>
  if (error) return <p>{error}</p>
  if (!donations.length) return <p>No has realizado donaciones aún.</p>

  return (
    <div className="donation-history-container">
      <h2>Historial de Donaciones Realizadas</h2>
      <ul className="donation-history-list">
        {donations.map((donation) => {
          const fecha = donation.createdAt
            ? new Date(donation.createdAt).toLocaleDateString()
            : 'Fecha no disponible'

          return (
            <li key={donation._id}>
              <p><strong>ID Donación:</strong> {donation._id}</p>
              <p><strong>Monto:</strong> Q{donation.amount}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
              <p><strong>Institución:</strong> {donation.institutionData?.name || 'No disponible'}</p>
              <hr />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
