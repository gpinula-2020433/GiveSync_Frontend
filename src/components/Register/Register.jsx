import React, { useState } from 'react'
import { Input } from '../Input'
import { useRegister } from '../../shared/hooks/useRegister'
import { emailValidationMessage, nameValidationMessage, passConfirmValidationMessage, 
    passwordValidationMessage, surnameValidationMessage, usernameValidationMessage, validateEmail, 
    validateName, 
    validatePassConfirm, validatePassword, validateSurname, validateUsername 
} from '../../shared/validators/validator'
import { Link } from 'react-router-dom'

export const Register = () => {
    const form = {
        name: {
            value: '',
            isValid: false,
            showError: false
        },
        surname: {
            value: '',
            isValid: false,
            showError: false
        },
        email: {
            value: '',
            isValid: false,
            showError: false
        },
        username: {
            value: '',
            isValid: false,
            showError: false
        },
        password: {
            value: '',
            isValid: false,
            showError: false
        },
        passwordConfirm: {
            value: '',
            isValid: false,
            showError: false
        }
    }
const [formData, setFormData] = useState(form)
    const { register } = useRegister()
    const isSubmitButtonDisabled = !formData.name.isValid ||
                                    !formData.surname.isValid ||
                                    !formData.email.isValid ||
                                    !formData.username.isValid ||
                                    !formData.password.isValid ||
                                    !formData.passwordConfirm.isValid
    
    //Todas las funciones o acciones comienzan con Handle
    const handleSubmit = (event)=>{
        event.preventDefault()
        //const input = document.getElementById('name')
        console.log(formData)
        register(
            formData.name.value,
            formData.surname.value,
            formData.email.value,
            formData.username.value,
            formData.password.value
        )
    }

    //Validar si el valor es correcto
    const handleValidationOnBlur = (value, field) =>{
        let isValid = false
        switch (field) {
            //Los 'case' tienen que llamarse igual a los datos del
            //formulario para que lo valide
            case 'name':
                isValid = validateName(value)
                break
            case 'surname':
                isValid = validateSurname(value)
                break
            case 'email':
                isValid = validateEmail(value)
                break;
            case 'username':
                isValid = validateUsername(value)
                break;
            case 'password':
                isValid = validatePassword(value)
                break;
            case 'passwordConfirm':
                isValid = validatePassConfirm(formData.password.value, value)
                break;
            default:
                break;
        }
        setFormData((prevData)=> (
            {
                ...prevData,
                //Inyección de nuevo valor:
                [field]: {
                    ...prevData[field],
                    isValid,
                    showError: !isValid
                }
            }
        ))
    }

                        //nuevo valor //input que cambió
    const handleValueChange = (value, field)=>{
        setFormData((prevData)=> (
            {
                ...prevData,
                //Inyección de nuevo valor:
                [field]: {
                    ...prevData[field],
                    value
                }
            }
        ))
    }

  return (
    <div className='register-container'>
        {/* 
            Formularios no controlados (DOM)
            Formularios controlados (RECOMENDABLE EN REACT) (Virtual DOM)
         */}
        <form 
            className='auth-form' 
            action=''
            onSubmit={handleSubmit}>
            <Input
                field='name'
                label='Name'
                value={formData.name.value}
                onChangeHandler={handleValueChange}
                placeholder={formData.name.value}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.name.showError}
                validationMessage={nameValidationMessage}
            />
            <Input
                field='surname'
                label='Surname'
                value={formData.surname.value}
                onChangeHandler={handleValueChange}
                placeholder={formData.surname.value}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.surname.showError}
                validationMessage={surnameValidationMessage}
            />
            <Input 
                field='email' //Tiene que llamarse igual que el formData
                label='Email' 
                value={formData.email.value}
                onChangeHandler={handleValueChange}
                placeholder={formData.email.value}
                type='email'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.email.showError}
                validationMessage={emailValidationMessage}
            />
            <Input 
                field='username'
                label='Username' 
                onChangeHandler={handleValueChange}
                value={formData.username.value} 
                placeholder={formData.username.value}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.username.showError}
                validationMessage={usernameValidationMessage}
            />
            <Input 
                field='password'
                label='Password' 
                onChangeHandler={handleValueChange}
                value={formData.password.value} 
                type='password'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.password.showError}
                validationMessage={passwordValidationMessage}
            />
            <Input 
                field='passwordConfirm'
                label='Password Confirmation' 
                onChangeHandler={handleValueChange}
                value={formData.passwordConfirm.value} 
                type='password'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.passwordConfirm.showError}
                validationMessage={passConfirmValidationMessage}
            />
            <button disabled={isSubmitButtonDisabled} type='submit'>
                Enviar
            </button>
        </form>
        <div className='redirect-to-login'>
            <p>Ya tienes cuenta? <Link to="/auth/login">Inicia seción aquí</Link></p>
        </div>
    </div>
  )
}
