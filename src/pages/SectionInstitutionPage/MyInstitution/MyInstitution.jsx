import { useEffect, useState } from "react";
import { getMyInstitutionsRequest } from "../../../services/api"
import './MyInstitution.css'

export const MyInstitution = () => {
  const [institution, setInstitution] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions?.length > 0) {
        setInstitution(res.institutions[0]);
      }
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="container mt-4">Cargando...</div>

  if (!institution)
    return (
      <div className="container mt-5">
        <h3 className="text-center">No tienes ninguna institución registrada.</h3>
      </div>
    )

    const traducirTipo = (tipo) => {
      switch (tipo) {
        case "ORPHANAGE": return "ORFANATO";
        case "EATERS": return "COMEDOR";
        case "ACYL": return "ASILO";
        default: return tipo;
      }
    }

    const traducirEstado = (estado) => {
      switch (estado) {
        case "ACCEPTED": return "ACEPTADO";
        case "EARRING": return "PENDIENTE";
        case "REFUSED": return "RECHAZADO";
        default: return estado;
      }
    }

    return (
    <div className="container py-4 my-institution-container">
      <h2 className="my-institution-title">{institution.name}</h2>
      <p className="my-institution-description">{institution.description}</p>
      <p className="my-institution-description">Dirección: {institution.address}</p>
      <p className="my-institution-description">Teléfono: {institution.phone}</p>
      <p className="my-institution-description">Tipo: {traducirTipo(institution.type)}</p>
      <p className="my-institution-description">Estado: {traducirEstado(institution.state)}</p>

      {institution.imageInstitution?.length > 0 && (
        <>
          <h4 className="my-institution-images-title">Imágenes de la Institución</h4>
          <div className={`my-institution-images-container ${institution.imageInstitution.length === 1 ? 'single' : ''}`}>
            {institution.imageInstitution.map((img, i) => (
              <div className="my-institution-image-wrapper" key={i}>
                <img
                  src={`/uploads/img/users/${img}`}
                  alt={institution.name}
                  className="my-institution-image"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}