import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInstitutions } from '../../../shared/hooks/Institution/useInstitution'

const InstitutionDetail = () => {
  const { id } = useParams()
  const { institution, loading, error, fetchInstitutionById } = useInstitutions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselActive, setCarouselActive] = useState(true)

  useEffect(() => {
    fetchInstitutionById(id)
  }, [id])

  useEffect(() => {
    setCurrentIndex(0)
  }, [institution?.imageInstitution])

  useEffect(() => {
    if (!carouselActive) return
    if (!institution?.imageInstitution) return

    const images = Array.isArray(institution.imageInstitution)
      ? institution.imageInstitution
      : [institution.imageInstitution]

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [institution, carouselActive])

  if (loading) return <p>Cargando detalles...</p>
  if (error) return <p>{error}</p>
  if (!institution) return null

  const images = Array.isArray(institution.imageInstitution)
    ? institution.imageInstitution
    : institution.imageInstitution
    ? [institution.imageInstitution]
    : []

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
    style={{
      maxWidth: carouselActive ? 700 : '1000px',
      margin: '0 auto',
      padding: 20,
      fontFamily: 'Arial, sans-serif',
      transition: 'max-width 0.3s ease',
    }}
  >
      <h1>{institution.name}</h1>
      <p><strong>Descripción:</strong> {institution.description}</p>

      <button
        style={{
          padding: '10px 20px',
          margin: '15px 0',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Donar
      </button>

      <div style={{marginTop: '20px',
                    marginBottom: '20px',
                    width: carouselActive ? '100%' : '120%',
                    overflowX: carouselActive ? 'hidden' : 'auto',
                    marginLeft: carouselActive ? '0' : '0%',}}>
        {images.length > 0 ? (
          carouselActive ? (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 500,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: 10,
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                  fontSize: 24,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                aria-label="Imagen anterior"
              >
                ‹
              </button>

              <img
                src={`/uploads/img/users/${images[currentIndex]}`}
                alt={`${institution.name} imagen ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />

              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: 10,
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                  fontSize: 24,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </div>
          ) : (
            <>
              {Array.isArray(institution.imageInstitution) ? (
                institution.imageInstitution.map((img, i) => (
                  <img
                    key={i}
                    src={`/uploads/img/users/${img}`}
                    alt={`${institution.name} ${i + 1}`}
                    style={{
                      width: '300px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      marginRight: '10px',
                      marginBottom: '10px',
                    }}
                  />
                ))
              ) : (
                <img
                  src={`/uploads/img/users/${institution.imageInstitution}`}
                  alt={institution.name}
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '10px',
                  }}
                />
              )}
            </>
          )
        ) : (
          <p>No hay imagen disponible</p>
        )}
      </div>

      <button
        onClick={() => setCarouselActive((prev) => !prev)}
        style={{
          padding: '8px 16px',
          margin: '0 0 20px',
          backgroundColor: carouselActive ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {carouselActive ? 'Ver imágenes estáticas' : 'Ver como carrusel'}
      </button>

      <p><strong>Tipo:</strong> {institution.type || 'No especificado'}</p>
      <p><strong>Estado:</strong> {institution.status || 'Desconocido'}</p>
    </div>
  )
}

export default InstitutionDetail
