import { useState, useEffect } from 'react'
import {
  getAuthenticatedUserRequest,
  updateUserImageRequest,
  deleteUserImageRequest
} from '../../../services/api'
import toast from 'react-hot-toast'

export const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const res = await getAuthenticatedUserRequest()
      if (!res.error) {
        setUser(res)
      } else {
        toast.error(res.message || 'No se pudo cargar la información del usuario')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al obtener los datos del usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserImage = async (file) => {
    try {
      const formData = new FormData()
      formData.append('imageUser', file)

      const res = await updateUserImageRequest(formData)
      if (!res.error) {
        setUser(res.user)
        toast.success(res.message || 'Imagen actualizada con éxito')
      } else {
        toast.error(res.message || 'Error al actualizar imagen')
      }
    } catch (err) {
      toast.error('Error al actualizar la imagen')
    }
  }

  const deleteUserImage = async () => {
    try {
      const res = await deleteUserImageRequest()
      if (!res.error) {
        setUser(res.user)
        toast.success(res.message || 'Imagen eliminada correctamente')
      } else {
        toast.error(res.message || 'Error al eliminar imagen')
      }
    } catch (err) {
      toast.error('Error al eliminar la imagen')
    }
  }

  return {
    user,
    isLoading,
    updateUserImage,
    deleteUserImage
  }
}
