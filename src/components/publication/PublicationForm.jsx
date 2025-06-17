import React, { useState } from 'react'
import { usePublicationActions } from '../../shared/hooks/publication/usePublicationActions'

const PublicationForm = ({ institutionId, onSuccess, existingPublication }) => {
  const isEdit = Boolean(existingPublication)
  const [title, setTitle] = useState(existingPublication?.title || '')
  const [content, setContent] = useState(existingPublication?.content || '')
  const [image, setImage] = useState(null)
  const { createPublication, updatePublication, updatePublicationImage, loading } =
  usePublicationActions()
    

  const handleSubmit = async e => {
    e.preventDefault()

    if (isEdit) {
      await updatePublication(existingPublication._id, { title, content })
      if (image) {
        const formData = new FormData()
        formData.append('image', image)
        await updatePublicationImage(existingPublication._id, formData)
      }
    } else {
      await createPublication({ title, content, institutionId })
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <br />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <br />
      <button type="submit" disabled={loading}>
        {isEdit ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  )
}

export default PublicationForm
