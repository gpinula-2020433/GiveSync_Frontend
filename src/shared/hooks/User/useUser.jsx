import { useState, useEffect } from 'react'
import {
  getAuthenticatedUserRequest,
  updateUserImageRequest,
  deleteUserImageRequest,
  updateUserRequest,
  deleteUserAccountRequest,
  updatePasswordRequest
} from '../../../services/api'
import toast from 'react-hot-toast'

export const useUser = () => {
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

  // Nueva función para actualizar datos
  const updateUser = async (data) => {
    try {
      const res = await updateUserRequest(data)
      if (!res.error) {
        setUser(res.user)
        toast.success(res.message || 'Usuario actualizado con éxito')
      } else {
        // Si viene errors, mostrar cada uno (opcional)
        if (res.errors) {
          res.errors.forEach(err => toast.error(err.msg))
        } else {
          toast.error(res.message || 'Error al actualizar usuario')
        }
      }
    } catch (err) {
      toast.error('Error al actualizar el usuario')
    }
  }


  const deleteUserAccount = async (password) => {
  try {
    const res = await deleteUserAccountRequest(password)
    if (!res.error) {
      toast.success(res.message || 'Cuenta eliminada con éxito', {duration: 4700})
      return { success: true }
    } else {
      toast.error(res.message)
      return { success: false }
    }
  } catch (err) {
    toast.error('Error al eliminar la cuenta')
    return { success: false }
  }
}

const updatePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await updatePasswordRequest({ currentPassword, newPassword })
      if (!res.error) {
        toast.success(res.message || 'Contraseña actualizada con éxito')
        return { success: true }
      } else {
        toast.error(res.message)
        return { success: false }
      }
    } catch (err) {
      toast.error('Error al actualizar la contraseña')
      return { success: false }
    }
  }
  return {
    user,
    isLoading,
    updateUserImage,
    deleteUserImage,
    updateUser,
      deleteUserAccount,
      updatePassword // <-- exporto la función
  }
}
