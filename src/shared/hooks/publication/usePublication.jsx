import { useEffect, useState, useCallback } from "react"
import { getPublicationsByInstitutionRequest } from "../../../services/api"
import { useSocket } from '../useSocket'

export const usePublicationsByInstitution = (institutionId) => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPublications = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getPublicationsByInstitutionRequest(institutionId)
      setPublications(response.data?.publications || [])
      setError(null) // limpiar errores si todo va bien
    } catch (err) {
      setPublications([]) // asegurar array vacío para evitar errores en render
      setError('Error al obtener publicaciones')
    } finally {
      setLoading(false)
    }
  }, [institutionId])

  useEffect(() => {
    if (institutionId) fetchPublications()
  }, [institutionId, fetchPublications])

  // Nuevas publicaciones por socket
  useSocket('newPublication', (newPub) => {
    if (newPub.institutionId === institutionId) {
      setPublications(prev => [newPub.publication, ...prev])
      setError(null) // limpiar error si lo había
    }
  })

  // Actualizaciones
  useSocket('updatePublication', (updatedPub) => {
    if (updatedPub.institutionId === institutionId) {
      setPublications(prev =>
        prev.map(pub => (pub._id === updatedPub.publication._id ? updatedPub.publication : pub))
      )
      setError(null)
    }
  })

  // Eliminaciones
  useSocket('deletePublication', (data) => {
    if (data.institutionId === institutionId) {
      setPublications(prev => prev.filter(pub => pub._id !== data.publicationId))
      setError(null)
    }
  })

  return { publications, loading, error, refetch: fetchPublications }
}
