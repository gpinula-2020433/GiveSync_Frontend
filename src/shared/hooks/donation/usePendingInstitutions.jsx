// ✅ hooks/usePendingInstitutions.js
import { useEffect, useState } from 'react'
import { fetchPendingInstitutions, updateInstitutionState } from '../../../services/api'
import { useSocket } from '../useSocket' // asegúrate que la ruta sea correcta

export const usePendingInstitutions = () => {
  const [institutions, setInstitutions] = useState([])
  const [imageIndexes, setImageIndexes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  // Escuchar nuevas instituciones desde el backend
  useSocket('newInstitution', (newInst) => {
    setInstitutions((prev) => [newInst, ...prev])
    setImageIndexes((prev) => ({
      ...prev,
      [newInst._id]: 0
    }))
  })

  const fetchData = async () => {
    setLoading(true)
    const { status, data } = await fetchPendingInstitutions()
    if (!status) {
      if (data.message?.toLowerCase().includes('no pending')) {
        setInstitutions([])
        setError('')
      } else {
        setInstitutions([])
        setError(data.message || 'Error al obtener instituciones')
      }
    } else {
      setInstitutions(data.institutions || [])
      setError('')
      const indexMap = {}
      data.institutions.forEach(inst => {
        indexMap[inst._id] = 0
      })
      setImageIndexes(indexMap)
    }
    setLoading(false)
  }

  const updateState = async (id, newState) => {
    const { status, data } = await updateInstitutionState(id, newState)
    if (!status) {
      alert(`Error: ${data.message}`)
    } else {
      setInstitutions(prev => prev.filter(inst => inst._id !== id))
    }
  }

  const nextImage = (id, length) => {
    setImageIndexes(prev => ({
      ...prev,
      [id]: prev[id] < length - 1 ? prev[id] + 1 : 0
    }))
  }

  const prevImage = (id, length) => {
    setImageIndexes(prev => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : length - 1
    }))
  }

  return {
    institutions,
    imageIndexes,
    loading,
    error,
    updateState,
    nextImage,
    prevImage
  }
}
