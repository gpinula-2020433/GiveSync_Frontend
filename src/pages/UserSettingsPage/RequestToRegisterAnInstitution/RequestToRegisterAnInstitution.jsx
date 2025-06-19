import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { createInstitutionRequest, getMyInstitutionsRequest } from '../../../services/api'
import './RequestToRegisterAnInstitution.css'

export const RequestToRegisterAnInstitution = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    type: '',
    imageInstitution: null
  })

  const [hasInstitution, setHasInstitution] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstitution = async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions && res.institutions.length > 0) {
        setHasInstitution(true)
      }
      setLoading(false)
    }
    fetchInstitution()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageInstitution: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataToSend = new FormData()
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'imageInstitution' && val) {
        dataToSend.append(key, val)
      } else if (key !== 'imageInstitution') {
        dataToSend.append(key, val)
      }
    })

    const res = await createInstitutionRequest(dataToSend)
    if (res.error) {
      toast.error('Error al registrar institución')
    } else {
      toast.success('Institución registrada con éxito')
      navigate('/sectioninstitution/MyInstitution')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white text-lg">
      Cargando...
    </div>
  )

  if (hasInstitution) {
    return (
      
      <div className="max-w-lg mx-auto mt-20 p-10 bg-zinc-900 rounded-xl shadow-lg border border-zinc-700 text-center">
        <h1 className="text-white text-3xl font-semibold mb-3">Acceso restringido</h1>
        <p className="text-zinc-400 text-md">
          Ya tienes una institución registrada. Solo se permite una por cuenta.
        </p>
      </div>
    )
  }

  return (
    <div className="register-institution-page">
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-xl p-10 border border-zinc-700">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
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
              className="w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              onChange={handleFileChange}
              className="w-full bg-zinc-800 text-zinc-300 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-shadow shadow-lg hover:shadow-emerald-500/30"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

const Field = ({ label, name, type, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    )}
  </div>
)
