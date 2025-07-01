import { useState, useEffect } from 'react'
import { getAuthenticatedUserRequest } from '../../../services/api'
import { decodeToken } from '../../utils/decodeToken'
import { useSocket } from '../useSocket'

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

  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  const uid = decoded?.uid

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem('token')
        setIsLoading(false)
        return
      }

      if (uid) {
        setUserId(uid)
        console.log('ID del usuario logueado:', uid)
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
  }, [token, uid])

  // 🔌 Escuchar cambios en la imagen de perfil
  useSocket('updateUserImage', (updatedUser) => {
    if (updatedUser?._id === uid) {
      setUser(prev => ({
        ...prev,
        imageUser: updatedUser.imageUser
      }))
    }
  })

  // 🔌 Escuchar cambios en la relación con institución
  useSocket('updateUserHasInstitution', (updatedUser) => {
    if (updatedUser?._id === uid) {
      setUser(prev => ({
        ...prev,
        hasInstitution: updatedUser.hasInstitution,
        institutionId: updatedUser.institutionId
      }))
    }
  })

  return {
    user,
    userId,
    isLoading
  }
}
