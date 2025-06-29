import { useState, useEffect } from 'react'
import { getAuthenticatedUserRequest } from '../../../services/api'
import { decodeToken } from '../../utils/decodeToken'

function isTokenValid(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return false

  const now = Date.now() / 1000
  return decoded.exp > now
}

export const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      // Verificamos si el token es válido
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem('token')
        setIsLoading(false)
        return
      }

      try {
        const res = await getAuthenticatedUserRequest()

        if (res?.message === 'Usuario no encontrado - No autorizado') {
          localStorage.removeItem('token')
          window.location.reload()
          return
        }

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
