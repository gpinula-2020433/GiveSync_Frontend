import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { createInstitutionRequest, getMyInstitutionsRequest } from '../../../services/api'
import './RequestToRegisterAnInstitution.css'
import { validatePhone } from '../../../shared/validators/validator'

export const RequestToRegisterAnInstitution = () => {
  const navigate = useNavigate()
  const [phoneError, setPhoneError] = useState(false)
  const [institution, setInstitution] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    type: '',
    imageInstitution: []
  })

  const [hasInstitution, setHasInstitution] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstitution = async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions && res.institutions.length > 0) {
        setInstitution(res.institutions[0])
        setHasInstitution(true)
      }
      setLoading(false)
    }
    fetchInstitution()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if(name === 'phone'){
      if(validatePhone(value)){
        setPhoneError(false)
      }else{
        setPhoneError(true)
      }
    }
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageInstitution: Array.from(e.target.files) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!validatePhone(formData.phone)){
      setPhoneError(true)
      toast.error("Ingrese un número de teléfono válido")
      return
    }else{
      setPhoneError(false)
    }

    const dataToSend = new FormData()

    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'imageInstitution' && val.length > 0) {
        val.forEach(file => dataToSend.append('imageInstitution', file))
      } else if (key !== 'imageInstitution') {
        dataToSend.append(key, val)
      }
    })

    const res = await createInstitutionRequest(dataToSend)
     if (res.error) {
    const errorMessage = Array.isArray(res.message) 
    ? res.message[0]?.msg || 'Error desconocido'
    : res.message || 'Error desconocido'

  toast.error(errorMessage)
  } else {
    toast.success('Institución registrada con éxito')
    navigate('/usersettings/RequestToRegisterAnInstitution')
    window.location.reload()
  }
  }

  if (loading) return (
    <div >
      Cargando...
    </div>
  )

  const translateType = (type) => {
    switch (type) {
      case 'ORPHANAGE':
        return 'ORFANATO'
      case 'ACYL':
        return 'ASILO'
      case 'EATERS':
        return 'COMEDOR'
      default:
        return type
    }
  }

  if (hasInstitution && institution) {
    return (
      <div className="institution-card">
      <h1>Ya tienes una institución registrada</h1>
      
      <div>
        <div className='institution-details'>
          <p><span>Nombre:</span> {institution.name}</p>
          <p><span>Descripción:</span> {institution.description}</p>
          <p><span>Dirección:</span> {institution.address}</p>
          <p><span>Teléfono:</span> {institution.phone}</p>
          <p><span>Tipo:</span> {translateType(institution.type)}</p>
        </div>

        <div>
          <p className="institution-images-title">Imágenes:</p>
          <div className="institution-images">
            {(institution.imageInstitution || []).map((imgUrl, i) => (
                <img
                  key={i}
                  src={`/uploads/img/users/${imgUrl}`}
                  alt={institution.name}
                  className="my-institution-image"
                />
            ))}
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="register-institution-page">
    <div className="form-container">
      <div>
        <h1 className="text-4xl font-bold mb-8 text-center">
          Nueva institución
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field
            label="Nombre de la institución"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Field
            label="Descripción"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Field
            label="Dirección"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Field
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={phoneError}
          />
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Tipo de institución
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecciona una opción</option>
              <option value="ORPHANAGE">Orfanato</option>
              <option value="ACYL">Hogar de ancianos</option>
              <option value="EATERS">Comedor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Imagen de la institución
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full bg-zinc-800 text-zinc-300 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-emerald-600 file: hover:file:bg-emerald-700 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl transition-shadow shadow-lg hover:shadow-emerald-500/30"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

const Field = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required
        maxLength={name === 'phone' ? 15: undefined}
        className={`w-full bg-zinc-800 border ${
          error ? 'border-red-500' : 'border-zinc-600'
        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
        } resize-none`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        maxLength={name === 'phone' ? 8 : undefined}
        className={`w-full bg-zinc-800 border rounded-lg px-4 
          py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 
          ${error ? 'input-error' : 'border-zinc-600'}`}
      />
    )}
    {error && (
      <p className="error-message">
          El telefono debe tener 8 dígitos y solo contener números.
      </p>
    )}
  </div>
)
