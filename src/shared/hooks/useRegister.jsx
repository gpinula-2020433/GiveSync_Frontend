import React, { useState } from 'react'
import { registerRequest } from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const register = async (name, surname, email, username, password) => {
    setIsLoading(true);
    const user = {
      name,
      surname,
      username,
      email,
      password
    };

    const response = await registerRequest(user);
    setIsLoading(false);

    // Manejo de errores del backend
    if (response.error) {
      setError(true);

      // Si vienen errores de validación
      if (response?.err?.response?.data?.errors) {
        const arrayErrors = response.err.response.data.errors;
        arrayErrors.forEach(err => {
          toast.error(err.msg);
        });
        return;
      }

      // Mensaje general de error
      return toast.error(
        response?.err?.response?.data?.message ||  // middleware o controlador
        response?.err?.data?.message ||            // fallback
        'Error general al intentar registrar el usuario. Intente de nuevo.'
      );
    }

    // Si no hubo error, mostrar mensaje exitoso del backend
    setError(false);
    toast.success(response.data?.message || 'Registro exitoso, ya puede iniciar sesión');

    // Redirigir luego de un tiempo
    setTimeout(() => {
      navigate('/auth/login');
    }, 2700);
  };

  return {
    register,
    isLoading,
    error,
    setError
  };
};
