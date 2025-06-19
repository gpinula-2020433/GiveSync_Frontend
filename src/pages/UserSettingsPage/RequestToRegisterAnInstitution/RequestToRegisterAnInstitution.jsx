import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { createInstitutionRequest, getMyInstitutionsRequest } from '../../../services/api'

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
    dataToSend.append('name', formData.name)
    dataToSend.append('description', formData.description)
    dataToSend.append('address', formData.address)
    dataToSend.append('phone', formData.phone)
    dataToSend.append('type', formData.type)

    if (formData.imageInstitution) {
      dataToSend.append('imageInstitution', formData.imageInstitution)
    }

    const res = await createInstitutionRequest(dataToSend)

    if (res.error) {
      toast.error('Error al registrar institución')
    } else {
      toast.success('Institución registrada con éxito')
      navigate('/sectioninstitution/MyInstitution')
    }
  }

  if (loading) return <div className="text-center py-8">Cargando...</div>

  if (hasInstitution) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center bg-yellow-100 border border-yellow-300 p-6 rounded-md shadow">
        <h2 className="text-2xl font-semibold text-yellow-800">Ya tienes una institución registrada</h2>
        <p className="mt-2 text-yellow-700">No puedes registrar más de una institución con esta cuenta.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl dark:bg-zinc-800">
      <h2 className="text-2xl font-bold mb-4 text-center text-zinc-700 dark:text-white">Solicitar registro de institución</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre de la institución"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona un tipo de institución</option>
          <option value="ORPHANAGE">Orfanato</option>
          <option value="ACYL">Hogar de ancianos</option>
          <option value="EATERS">Comedor</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
        >
          Enviar solicitud
        </button>
      </form>
    </div>
  )
}
