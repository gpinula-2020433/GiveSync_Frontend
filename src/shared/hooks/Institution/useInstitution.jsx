import { useState, useEffect } from 'react'
import { getAcceptedInstitutions, getInstitutionById } from '../../../services/api'
import { useSocket } from '../useSocket'

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

  // Escuchar actualizaciones de instituciones en tiempo real
  useSocket('updateInstitution', (updatedInstitution) => {
    setInstitutions(prev => {
      const exists = prev.some(inst => inst._id === updatedInstitution._id)

      // Si ya existe, actualiza; si no, lo agrega solo si está ACCEPTED
      if (exists) {
        return prev.map(inst =>
          inst._id === updatedInstitution._id ? updatedInstitution : inst
        )
      } else if (updatedInstitution.state === 'ACCEPTED') {
        return [updatedInstitution, ...prev]
      } else {
        return prev
      }
    })

    // Actualizar el detalle si corresponde
    setInstitution(prev => {
      if (prev?._id === updatedInstitution._id) {
        return updatedInstitution
      }
      return prev
    })
  })

    // Escuchar eliminación de institución en tiempo real
  useSocket('deleteInstitution', ({ _id }) => {
    setInstitutions(prev => prev.filter(inst => inst._id !== _id))
    setInstitution(prev => (prev?._id === _id ? null : prev))
  })

  return {
    institutions,
    institution,
    loading,
    error,
    fetchAcceptedInstitutions,
    fetchInstitutionById,
  }
}
