// shared/hooks/User/useUsers.js
import { useState, useEffect } from 'react'
import { getAllUsersRequest } from '../../../services/api'
import toast from 'react-hot-toast'
import { useSocket } from '../useSocket' // tu hook de socket

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [])

  // socket: escuchar cuando un usuario se registra
  useSocket('newUser', (data) => {
    setUsers((prev) => [data, ...prev])
    setTotal((prev) => prev + 1)
  })

  // socket: escuchar cuando un usuario se actualiza
  useSocket('updateUser', (data) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === data._id ? data : u))
    )
  })

  // socket: escuchar cuando un usuario se elimina
  useSocket('deleteUser', (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId))
    setTotal((prev) => prev - 1)
  })

  // opcional: si quieres refrescar la imagen de perfil
  useSocket('updateUserImage', (data) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === data._id ? data : u))
    )
  })

  const fetchUsers = async () => {
    setIsLoading(true)
    const res = await getAllUsersRequest()
    if (!res.error) {
      setUsers(res.data || [])
      setTotal(res.total || 0)
    } else {
      toast.error(res.message || 'Error al cargar usuarios')
    }
    setIsLoading(false)
  }

  return { users, total, isLoading }
}
