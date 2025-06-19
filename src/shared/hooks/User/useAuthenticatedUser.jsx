import { useState, useEffect } from 'react'
import { getAuthenticatedUserRequest } from '../../../services/api'

export const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const res = await getAuthenticatedUserRequest()
        if (!res.error) {
          setUser(res)
        }
      } catch (err) {
        console.error('Error al obtener usuario autenticado', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return {
    user,
    isLoading
  }
}