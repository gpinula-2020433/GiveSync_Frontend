import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest } from '../services/api'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (userLoggin, password) => {
    setLoading(true)
    try {
      const response = await loginRequest({ userLoggin, password })

      const token = response.data?.token
      const loggedUser = response.data?.loggedUser

      if (!token || !loggedUser) {
        toast.error('Faltan datos en la respuesta del servidor')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(loggedUser))

      setUser(loggedUser)
      toast.success(response.data?.message || 'Inicio de sesión exitoso')
    } catch (err) {
      const errorData = err?.response?.data

      if (errorData?.errors) {
        for (const error of errorData.errors) {
          toast.error(error.msg)
        }
      } else {
        toast.error(errorData?.message || 'Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Sesión cerrada')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext)
