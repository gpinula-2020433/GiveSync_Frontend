import { useState, useEffect } from 'react'
import { getAcceptedInstitutions, getInstitutionById } from '../../../services/api'

export function useInstitutions() {
  const [institutions, setInstitutions] = useState([])
  const [institution, setInstitution] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar todas las instituciones aceptadas
  const fetchAcceptedInstitutions = () => {
    setLoading(true)
    getAcceptedInstitutions()
      .then(data => {
        if (!data.error && data.success) {
          setInstitutions(data.institutions)
          setError(null)
        } else {
          setError('No se encontraron instituciones aceptadas')
          setInstitutions([])
        }
      })
      .catch(() => {
        setError('Error al cargar instituciones')
        setInstitutions([])
      })
      .finally(() => setLoading(false))
  }

  // Cargar institución por id
  const fetchInstitutionById = (id) => {
    if (!id) return
    setLoading(true)
    getInstitutionById(id)
      .then(data => {
        if (!data.error && data.success) {
          setInstitution(data.institution)
          setError(null)
        } else {
          setError('Institución no encontrada')
          setInstitution(null)
        }
      })
      .catch(() => {
        setError('Error al cargar la institución')
        setInstitution(null)
      })
      .finally(() => setLoading(false))
  }

  return {
    institutions,
    institution,
    loading,
    error,
    fetchAcceptedInstitutions,
    fetchInstitutionById,
  }
}
