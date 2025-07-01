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
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      if (!token || !isTokenValid(token)) {
        localStorage.removeItem('token')
        setIsLoading(false)
        return
      }

      const decoded = decodeToken(token)
      if (decoded?.uid) {
        setUserId(decoded.uid)
        console.log('ID del usuario logueado:', decoded.uid)
      } else {
        console.warn('No se pudo obtener el ID del token')
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
    userId,
    isLoading
  }
}
