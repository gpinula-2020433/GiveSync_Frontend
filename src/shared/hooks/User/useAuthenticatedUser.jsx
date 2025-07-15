import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getAuthenticatedUserRequest } from '../../../services/api'
import { decodeToken } from '../../utils/decodeToken'
import { useSocket } from '../useSocket'

const AuthenticatedUserContext = createContext()

function isTokenValid(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return false
  const now = Date.now() / 1000
  return decoded.exp > now
}

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    const decoded = token ? decodeToken(token) : null
    const uid = decoded?.uid

    if (!token) {
      localStorage.removeItem('token')
      setIsLoading(false)
      return
    }

    if (!isTokenValid(token)) {
      localStorage.removeItem('token')
      toast.error('Tu sesión ha expirado.')
      navigate('/main/home')
      setIsLoading(false)
      return
    }

    if (uid) {
      setUserId(uid)
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

  useEffect(() => {
    fetchUser()
  }, [navigate]) // Solo depende de navigate

  // 🔌 Socket: imagen de perfil
  useSocket('updateUserImage', (updatedUser) => {
    if (updatedUser?._id === userId) {
      setUser(prev => ({
        ...prev,
        imageUser: updatedUser.imageUser
      }))
    }
  })

  // 🔌 Socket: institución del usuario
  useSocket('updateUserHasInstitution', (updatedUser) => {
    if (updatedUser?._id === userId) {
      setUser(prev => ({
        ...prev,
        hasInstitution: updatedUser.hasInstitution,
        institutionId: updatedUser.institutionId
      }))
    }
  })

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        userId,
        isLoading,
        fetchUser // 🔁 lo exponemos correctamente
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

export const useAuthenticatedUserContext = () => useContext(AuthenticatedUserContext)
