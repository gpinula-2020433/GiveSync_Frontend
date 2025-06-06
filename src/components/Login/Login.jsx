import React, { useState } from 'react'
import { Input } from '../Input'
import { useLogin } from '../../shared/hooks/useLogin'
import { Link } from 'react-router-dom'

export const Login = () => {
  const form = {
    userLoggin: {
      value: '',
      isValid: false,
      showError: false
    },
    password: {
      value: '',
      isValid: false,
      showError: false
    }
  }

  const [formData, setFormData] = useState(form)
  const { login } = useLogin()

  const isSubmitButtonDisabled = !formData.userLoggin.isValid || !formData.password.isValid

  const handleSubmit = (event) => {
    event.preventDefault()
    login(
      formData.userLoggin.value,
      formData.password.value
    )
  }

  const handleValidationOnBlur = (value, field) => {
    const isValid = value.trim() !== ''
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        isValid,
        showError: !isValid
      }
    }))
  }

  const handleValueChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value
      }
    }))
  }

  return (
    <div className='login-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <Input
          field='userLoggin'
          label='Usuario o Email'
          value={formData.userLoggin.value}
          onChangeHandler={handleValueChange}
          placeholder={formData.userLoggin.value}
          type='text'
          onBlurHandler={handleValidationOnBlur}
          showErrorMessage={formData.userLoggin.showError}
          validationMessage='Este campo no puede estar vacío'
        />
        <Input
          field='password'
          label='Contraseña'
          value={formData.password.value}
          onChangeHandler={handleValueChange}
          placeholder={formData.password.value}
          type='password'
          onBlurHandler={handleValidationOnBlur}
          showErrorMessage={formData.password.showError}
          validationMessage='Este campo no puede estar vacío'
        />
        <button disabled={isSubmitButtonDisabled} type='submit'>
          Iniciar Sesión
        </button>
      </form>
      <div className='redirect-to-login'>
        <p>¿No tienes una cuenta? <Link to="/auth/register">Regístrate aquí</Link></p>
      </div>
    </div>
  )
}
