import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useInstitutions } from '../../../shared/hooks/Institution/useInstitution'
import { usePublicationsByInstitution } from '../../../shared/hooks/publication/usePublication'
import { useAuthenticatedUser } from '../../../shared/hooks/User/useAuthenticatedUser'
import './InstitutionDetail.css'

const InstitutionDetail = () => {
  const { id } = useParams()
  const { institution, loading, error, fetchInstitutionById } = useInstitutions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselActive, setCarouselActive] = useState(true)
  const [publicationImageIndexes, setPublicationImageIndexes] = useState({})
  const { publications, loading: loadingPublications, error: errorPublications } = usePublicationsByInstitution(id)
  const { user } = useAuthenticatedUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchInstitutionById(id)
  }, [id])

  useEffect(() => {
    setCurrentIndex(0)
  }, [institution?.imageInstitution])

  useEffect(() => {
    if (!carouselActive || !institution?.imageInstitution) return

    const images = Array.isArray(institution.imageInstitution)
      ? institution.imageInstitution
      : [institution.imageInstitution]

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [institution, carouselActive])

  const translateType = (type) => {
    const map = { ORPHANAGE: 'ORFANATO', EATERS: 'COMEDOR', ACYL: 'ASILO' }
    return map[type] || type
  }

  const translateState = (state) => {
    const map = { ACCEPTED: 'ACEPTADO', EARRING: 'PENDIENTE', REFUSED: 'RECHAZADO' }
    return map[state] || state
  }

  if (loading) return <p>Cargando detalles...</p>
  if (error) return <p>{error}</p>
  if (!institution) return null

  const images = Array.isArray(institution.imageInstitution)
    ? institution.imageInstitution
    : institution.imageInstitution
    ? [institution.imageInstitution]
    : []

  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  const handlePrevImage = (pubId, imagesLength) => {
    setPublicationImageIndexes((prev) => ({
      ...prev,
      [pubId]: prev[pubId] > 0 ? prev[pubId] - 1 : imagesLength - 1,
    }))
  }

  const handleNextImage = (pubId, imagesLength) => {
    setPublicationImageIndexes((prev) => ({
      ...prev,
      [pubId]: prev[pubId] < imagesLength - 1 ? prev[pubId] + 1 : 0,
    }))
  }

  return (
    <div className={`institution-detail ${carouselActive ? 'carousel-active' : 'carousel-inactive'}`}>
      <h1>{institution.name}</h1>
      <p><strong>Descripción:</strong> {institution.description}</p>

      <button
        onClick={() => {
          if (!user) {
            alert('Debes iniciar sesión para donar')
            return
          }
          navigate(`/main/institution/${institution._id}/donate`)
        }}
        className="donate-button"
      >
        Donar
      </button>

      <div className={`image-wrapper ${carouselActive ? 'carousel-mode' : 'static-mode'}`}>
        {images.length > 0 ? (
          carouselActive ? (
            <div className="carousel-container">
              <button onClick={prevImage} className="carousel-button left" aria-label="Imagen anterior">‹</button>
              <img
                src={`/uploads/img/users/${images[currentIndex]}`}
                alt={`${institution.name} imagen ${currentIndex + 1}`}
                className="carousel-image"
                draggable={false}
              />
              <button onClick={nextImage} className="carousel-button right" aria-label="Imagen siguiente">›</button>
            </div>
          ) : (
            <>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={`/uploads/img/users/${img}`}
                  alt={`${institution.name} ${i + 1}`}
                  className="static-image"
                />
              ))}
            </>
          )
        ) : (
          <p>No hay imagen disponible</p>
        )}
      </div>

      <button
        onClick={() => setCarouselActive((prev) => !prev)}
        className={`toggle-carousel ${carouselActive ? 'carousel-on' : 'carousel-off'}`}
      >
        {carouselActive ? 'Ver imágenes estáticas' : 'Ver como carrusel'}
      </button>

      <p><strong>Dirección:</strong> {institution.address}</p>
      <p><strong>Teléfono:</strong> {institution.phone}</p>
      <p><strong>Tipo:</strong> {translateType(institution.type) || 'No especificado'}</p>
      <p><strong>Estado:</strong> {translateState(institution.state) || 'Desconocido'}</p>

      <div>
        <h2>Publicaciones recientes</h2>
        {loadingPublications ? (
          <p>Cargando publicaciones...</p>
        ) : errorPublications ? (
          <p style={{ color: 'red' }}>{errorPublications}</p>
        ) : publications && publications.length === 0 ? (
          <p>No hay publicaciones de esta institución.</p>
        ) : (
          <ul>
            {publications.map((pub) => (
              <li key={pub._id} className="publication-item">
                <h3>{pub.title}</h3>
                <p>{pub.content}</p>

                {pub.imagePublication?.length > 0 && (
                  <div className="publication-image-container">
                    <img
                      src={`/uploads/img/users/${pub.imagePublication[publicationImageIndexes[pub._id] || 0]}`}
                      alt="Imagen de publicación"
                      className="publication-image"
                    />
                    {pub.imagePublication.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevImage(pub._id, pub.imagePublication.length)}
                          className="carousel-button left small"
                        >‹</button>
                        <button
                          onClick={() => handleNextImage(pub._id, pub.imagePublication.length)}
                          className="carousel-button right small"
                        >›</button>
                      </>
                    )}
                  </div>
                )}

                <p className="publication-date">
                  Publicado el: {new Date(pub.date).toLocaleDateString()}
                </p>

                <Link to={`/main/publication/${pub._id}`} className="btn btn-dark btn-sm px-3 shadow-sm" onClick={() => window.scrollTo(0, 0)}>
                  Ver más
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default InstitutionDetail
