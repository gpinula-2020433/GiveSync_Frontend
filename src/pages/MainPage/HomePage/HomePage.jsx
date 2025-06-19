import React, { useEffect } from 'react'
import { useInstitutions } from '../../../shared/hooks/Institution/useInstitution'
import { Link, useNavigate} from 'react-router-dom'

const HomePage = () => {
  const { institutions, loading, error, fetchAcceptedInstitutions } = useInstitutions()
  

  useEffect(() => {
    fetchAcceptedInstitutions()
  }, [])

  if (loading) return <p>Cargando instituciones...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Instituciones Aceptadas</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {institutions.map(inst => {
          let firstImage = null

          if (inst.imageInstitution) {
            if (Array.isArray(inst.imageInstitution)) {
              firstImage = inst.imageInstitution[0]
            } else {
              firstImage = inst.imageInstitution.split(',')[0]
            }
          }

          /* const handleClick = (e) => {
            if (!user) {
              e.preventDefault() // evita la navegación
              alert('Debes iniciar sesión para ver detalles')
            }
          } */

          return (
            <div key={inst._id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
              {firstImage && (
                <img
                  src={`/uploads/img/users/${firstImage.trim()}`}
                  alt={inst.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
                />
              )}
              <h2>{inst.name}</h2>
              <p>{inst.description}</p>
              <Link
                to={`/main/institution/${inst._id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007bff')}
              >
                Ver detalles
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
