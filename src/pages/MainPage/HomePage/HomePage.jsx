import React, { useEffect, useState } from 'react'
import { useInstitutions } from '../../../shared/hooks/Institution/useInstitution'
import { Link } from 'react-router-dom'
import './HomePage.css'

const HomePage = () => {
  const { institutions, loading, error, fetchAcceptedInstitutions } = useInstitutions()
  const [filteredType, setFilteredType] = useState('ALL')

  // Diccionario para traducir tipos al español
  const typeLabels = {
    EATERS: 'Comedor',
    ORPHANAGE: 'Orfanato',
    ACYL: 'Hogar de Ancianos',
  }

  useEffect(() => {
    fetchAcceptedInstitutions()
  }, [])

  const filteredInstitutions =
    filteredType === 'ALL'
      ? institutions
      : institutions.filter(inst => inst.type === filteredType)

  if (loading) return <p>Cargando instituciones...</p>

  return (
    <div className="homepage-container">
      <h1 className="title">Instituciones Aceptadas</h1>

      <div className="filter-buttons">
        <button onClick={() => setFilteredType('ALL')}>Todas</button>
        <button onClick={() => setFilteredType('EATERS')}>{typeLabels.EATERS}</button>
        <button onClick={() => setFilteredType('ORPHANAGE')}>{typeLabels.ORPHANAGE}</button>
        <button onClick={() => setFilteredType('ACYL')}>{typeLabels.ACYL}</button>
      </div>

      {error && <p className="error">{error}</p>}

      {filteredInstitutions.length === 0 ? (
        <p className="no-institutions-message">No existen instituciones para mostrar.</p>
      ) : (
        <div className="institution-grid">
          {filteredInstitutions.map(inst => {
            let firstImage = null

            if (inst.imageInstitution) {
              firstImage = Array.isArray(inst.imageInstitution)
                ? inst.imageInstitution[0]
                : inst.imageInstitution.split(',')[0]
            }

            return (
              <div className="institution-card" key={inst._id}>
                {firstImage && (
                  <img
                    src={`/uploads/img/users/${firstImage.trim()}`}
                    alt={inst.name}
                    className="institution-image"
                  />
                )}
                <h2>{inst.name}</h2>
                <p><strong>Tipo:</strong> {typeLabels[inst.type]}</p>
                <p><strong>Dirección:</strong> {inst.address}</p>
                <p><strong>Descripción:</strong> {inst.description}</p>
                <Link to={`/main/institution/${inst._id}`} className="details-button">
                  Ver detalles
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HomePage
