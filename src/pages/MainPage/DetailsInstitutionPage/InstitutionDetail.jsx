import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInstitutions } from '../../../shared/hooks/Institution/useInstitution'
import { usePublicationsByInstitution } from '../../../shared/hooks/publication/usePublication'
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from '../../../shared/hooks/User/useAuthenticatedUser';

const InstitutionDetail = () => {
  const { id } = useParams()
  const { institution, loading, error, fetchInstitutionById } = useInstitutions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselActive, setCarouselActive] = useState(true)
  const [publicationImageIndexes, setPublicationImageIndexes] = useState({});
  const { publications, loading: loadingPublications, error: errorPublications, refetch } = usePublicationsByInstitution(id)
  const {user} = useAuthenticatedUser()
  const navigate = useNavigate(); 

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

  const handlePrevImage = (pubId, imagesLength)=>{
    setPublicationImageIndexes(prev => ({
      ...prev,
      [pubId]: prev[pubId] > 0 ? prev[pubId] - 1 : imagesLength - 1,
    }))
  }

  const handleNextImage =  (pubId, imagesLength)=>{
    setPublicationImageIndexes(prev => ({
      ...prev,
      [pubId] : prev [pubId] < imagesLength - 1 ? prev[pubId] + 1 : 0
    }))
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
  onClick={() => {
    if (!user) {
      alert('Debes iniciar sesión para donar');
      return;
    }
    navigate(`/main/institution/${institution._id}/donate`);
  }}
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

      {/* Formulario para agregar publicación */}

      <div>
        <h2>Publicaciones recientes</h2>
        {loadingPublications ? (
        <p>Cargando publicaciones...</p>
        ) : errorPublications ? (
          <p>{errorPublications}</p>
        ) : publications.length === 0 ? (
          <p>No hay publicaciones de esta institución.</p>
        ) : (
        <ul>
  {publications.map((pub) => (
    <li key={pub._id} style={{ marginBottom: '20px', listStyle: 'none', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h3>{pub.title}</h3>
      <p>{pub.content}</p>
      

      {pub.imagePublication?.length > 0 && (
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 425,
            height: 400,
            overflow: 'hidden',
            margin: '25px auto',
            borderRadius: 10,
          }}>
          <img
            src={`/uploads/img/users/${pub.imagePublication[publicationImageIndexes[pub._id] || 0]}`}
            alt={`Imagen de publicación`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 10
            }}
          />

          {/* Botón izquierda */}
          {pub.imagePublication.length > 1 && (
            <>
              <button
                onClick={() => handlePrevImage(pub._id, pub.imagePublication.length)}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                  fontSize: 24,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ‹
              </button>

              {/* Botón derecha */}
              <button
                onClick={() => handleNextImage(pub._id, pub.imagePublication.length)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                  fontSize: 24,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ›
              </button>
            </>
          )}

        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        Publicado el: {new Date(pub.date).toLocaleDateString()}
      </p>
      
     <Link to={`/main/publication/${pub._id}`} className="btn btn-dark btn-sm px-3 shadow-sm">
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
