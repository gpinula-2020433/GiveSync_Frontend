import React, { useEffect, useState } from 'react'
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
        } else {
          setError('No se pudo obtener las donaciones')
        }
      } catch (err) {
        setError('Error al cargar las donaciones')
      }
      setLoading(false)
    }

    fetchDonations()
  }, [])

  if (loading) return <p>Cargando donaciones...</p>
  if (error) return <p>{error}</p>
  if (!donations.length) return <p>No hay donaciones registradas.</p>

  return (
    <div className="donations-container">
      <h2>Donaciones Realizadas</h2>
      <ul className="donations-list">
        {donations.map((donation) => {
          const fecha = donation.createdAt
            ? new Date(donation.createdAt).toLocaleDateString()
            : 'Fecha no disponible'

          return (
            <li key={donation._id} className="donation-item">
              <p className="icon-id"><strong>ID Donación:</strong> {donation._id}</p>
              <p className="icon-money"><strong>Monto:</strong> Q{donation.amount}</p>
              <p className="icon-calendar"><strong>Fecha:</strong> {fecha}</p>
              <p className="icon-institution"><strong>Institución:</strong> {donation.institutionData?.name || 'No disponible'}</p>
              <p className="icon-institution-type">
                <strong>Tipo de Institución:</strong> {donation.institutionData?.type || 'No disponible'}
              </p>

              <div className="user-details">
                <strong>Usuario:</strong>{' '}
                {donation.userData ? (
                  <>
                    <p className="icon-user">Nombre: {donation.userData.name} {donation.userData.surname}</p>
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

              <hr />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
