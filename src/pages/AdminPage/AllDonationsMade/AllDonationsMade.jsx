import React, { useEffect, useState } from 'react'
import { User, Calendar, DollarSign, Building, Tag } from 'lucide-react'
import axios from 'axios'
import './AllDonationsMade.css'

export const AllDonationsMade = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3200/v1/donation/', {
          headers: { Authorization: token }
        })
        if (res.data.success) {
          setDonations(res.data.donations)
          setError(null)
        } else {
          setError('No se pudo obtener las donaciones')
        }
      } catch {
        setError('Error al cargar las donaciones')
      }
      setLoading(false)
    }
    fetchDonations()
  }, [])

  if (loading) return <p className="all-loading-message">Cargando donaciones...</p>
  if (error) return <p className="all-error-message">{error}</p>
  if (!donations.length) return <p className="all-empty-message">No hay donaciones registradas.</p>

  return (
    <div className="all-donations-container">
      <h2>Donaciones Realizadas</h2>
      <ul className="all-donations-list">
        {donations.map((donation) => {
          const fecha = donation.createdAt
            ? new Date(donation.createdAt).toLocaleDateString()
            : 'Fecha no disponible'
          return (
            <li key={donation._id} className="all-donation-item">
              <p className="all-donation-line">
                <Tag className="all-icon" size={18} /> <strong>ID Donación:</strong> {donation._id}
              </p>
              <p className="all-donation-line">
                <DollarSign className="all-icon" size={18} /> <strong>Monto:</strong> Q{donation.amount}
              </p>
              <p className="all-donation-line">
                <Calendar className="all-icon" size={18} /> <strong>Fecha:</strong> {fecha}
              </p>
              <p className="all-donation-line">
                <Building className="all-icon" size={18} /> <strong>Institución:</strong> {donation.institutionData?.name || 'No disponible'}
              </p>
              <p className="all-donation-line">
                <Tag className="all-icon" size={18} /> <strong>Tipo de Institución:</strong> {donation.institutionData?.type || 'No disponible'}
              </p>

              <div className="all-user-details">
                <strong>Usuario:</strong>{' '}
                {donation.userData ? (
                  <>
                    <p className="all-donation-line">
                      <User className="all-icon" size={18} /> Nombre: {donation.userData.name} {donation.userData.surname}
                    </p>
                    <p>Usuario: {donation.userData.username}</p>
                    {donation.userData.email && <p>Email: {donation.userData.email}</p>}
                    {donation.userData.role && <p>Rol: {donation.userData.role}</p>}
                    {donation.userData.createdAt && (
                      <p>Registrado: {new Date(donation.userData.createdAt).toLocaleDateString()}</p>
                    )}
                    {donation.userData.updatedAt && (
                      <p>Última actualización: {new Date(donation.userData.updatedAt).toLocaleDateString()}</p>
                    )}
                  </>
                ) : (
                  'No disponible'
                )}
              </div>

              <hr className="all-donation-separator" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
