import React, { useEffect, useState } from 'react'
import { usePublicationActions } from '../../../shared/hooks/publication/usePublicationActions'
import { getMyInstitutionsRequest, getPublicationsByInstitutionRequest } from '../../../services/api'
import './ConfigurationPublication.css'


const ConfigurationPublication = () => {
  const [institutionId, setInstitutionId] = useState(null)
  const [publications, setPublications] = useState([])
  const [formData, setFormData] = useState({ title: '', content: '', image: null })
  const [editPublication, setEditPublication] = useState(null)

  const {
    addPublication,
    updatePublication,
    updateImagePublication,
    deletePublication,
    loading,
    setSuccess
  } = usePublicationActions()

  // Obtener institución del usuario autenticado
  useEffect(() => {
    const fetchInstitution = async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions.length > 0) {
        const inst = res.institutions[0]
        setInstitutionId(inst._id)
        fetchPublications(inst._id)
        }
    }

    fetchInstitution()
  }, [])

  // Obtener publicaciones
  const fetchPublications = async (instId) => {
    const res = await getPublicationsByInstitutionRequest(instId)
    if (!res.error) {
      setPublications(res.data.publications || [])
    }
  }

  // Manejo de inputs
  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: [...files] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Crear o actualizar publicación
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!institutionId) return

    if (editPublication) {
      await updatePublication(editPublication._id, {
        title: formData.title,
        content: formData.content
      })

      if (formData.image && formData.image.length > 0) {
        const imgForm = new FormData()
        formData.image.forEach(img =>{
          imgForm.append('imagePublication', img)
        })
        await updateImagePublication(editPublication._id, imgForm)
      }
    } else {
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('content', formData.content)
        formDataToSend.append('institutionId', institutionId)
    if (formData.image && formData.image.length > 0) {
        formData.image.forEach(img =>{
          formDataToSend.append('imagePublication', img)
        })
    }

    await addPublication(formDataToSend)

    }

    resetForm()
    fetchPublications(institutionId)
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', image: null })
    setEditPublication(null)
    setSuccess(false)
  }

  const handleEdit = pub => {
  setEditPublication(pub)
  setFormData({
    title: pub.title,
    content: pub.content,
    image: null
  })
 setTimeout(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}, 100)

}


  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      await deletePublication(id)
      fetchPublications(institutionId)
    }
  }

  return (
    <div className="configuration-publication-page">
    <div>
      <h2>{editPublication ? 'Editar publicación' : 'Agregar nueva publicación'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="content"
          placeholder="Contenido"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <br />
        <input type="file" name="image" onChange={handleChange} multiple/>
        <br />
        <button type="submit" disabled={loading}>
          {editPublication ? 'Actualizar' : 'Crear'}
        </button>
        {editPublication && (
          <button type="button" onClick={resetForm}>
            Cancelar edición
          </button>
        )}
      </form>

      <hr />

      <h2>Mis publicaciones</h2>
      <div className="publication-list">
    {publications.length === 0 ? (
      <p className="empty-state">No hay publicaciones aún.</p>
    ) : (
      publications.map(pub => (
        <div key={pub._id} className="publication-card">
          <h3>{pub.title}</h3>
          <p>{pub.content}</p>
          <div className="publication-images">
            {pub.imagePublication?.map((img, i) => (
              <img key={i} src={`/uploads/img/users/${img}`} alt="publicación" />
            ))}
          </div>
          <div className="btn-group">
            
            <button onClick={() => handleEdit(pub)}>Editar</button>
            <button onClick={() => handleDelete(pub._id)}>Eliminar</button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
</div>
  )
}

export default ConfigurationPublication