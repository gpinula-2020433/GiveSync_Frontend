import { useEffect, useState } from "react"
import { getPublicationsByInstitutionRequest } from "../../../services/api"

export const usePublicationsByInstitution = (institutionId) => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPublications = async () => {
    setLoading(true)
    try {
      const response = await getPublicationsByInstitutionRequest(institutionId)
      setPublications(response.data.publications || [])
      setError(null)
    } catch (err) {
      setError('Error al obtener publicaciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (institutionId) fetchPublications()
  }, [institutionId])

  return { publications, loading, error, refetch: fetchPublications }
}
