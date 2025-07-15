import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
  const navigate = useNavigate()  // <-- Aquí

  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  const uid = decoded?.uid

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        // Token no existe, sólo borrar y terminar sin toast ni redirect
        localStorage.removeItem('token')
        setIsLoading(false)
        return
      }

      if (!isTokenValid(token)) {
        // Token existe pero está expirado: toast + redirect
        localStorage.removeItem('token')
        toast.error('Tu sesión ha expirado.')
        navigate('/main/home')
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
  }, [token, uid, navigate])

  // Tus sockets igual

  useSocket('updateUserImage', (updatedUser) => {
    if (updatedUser?._id === uid) {
      setUser(prev => ({
        ...prev,
        imageUser: updatedUser.imageUser
      }))
    }
  })

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