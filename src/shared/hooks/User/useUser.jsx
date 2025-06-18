import { useState, useEffect } from 'react'
import { getAuthenticatedUserRequest } from '../../../services/api'

export const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const res = await getAuthenticatedUserRequest()
      if (!res.error) {
        setUser(res)
        setError(null)
      } else {
        setError('No se pudo cargar la información del usuario')
      }
    } catch (err) {
      setError('Error al obtener los datos del usuario')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error
  }
}
