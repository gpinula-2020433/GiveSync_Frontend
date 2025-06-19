import React, { useState, useEffect } from 'react'
import './CommentForm.css'

export const CommentForm = ({ publicationId, onNewComment, onCancel, editCommentData, onEditComment }) => {
  const [content, setContent] = useState(editCommentData?.content || '')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editCommentData) {
      setContent(editCommentData.content || '')
      setImageFile(null)
    }
  }, [editCommentData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('content', content)
    if (editCommentData) {
      if (imageFile) formData.append('commentImage', imageFile)
      const result = await onEditComment(editCommentData._id, formData)
      if (!result.error) {
        onCancel()
      } else {
        alert('Error al editar comentario')
      }
    } else {
      formData.append('publicationId', publicationId)
      if (imageFile) formData.append('commentImage', imageFile)
      const result = await onNewComment(formData)
      if (result.error) {
        alert('Error al agregar comentario')
      }
    }
    setLoading(false)
  }

  return (
    <div className="comment-form-page">
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Escribe tu comentario"
        required
        style={{ width: '100%', height: '80px', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImageFile(e.target.files[0])}
        style={{ marginBottom: '0.5rem' }}
      />
      <div>
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
          {loading ? (editCommentData ? 'Editando...' : 'Enviando...') : (editCommentData ? 'Guardar' : 'Comentar')}
        </button>
        <button
          type="button"
          onClick={() => {
            setContent('')
            setImageFile(null)
            onCancel()
          }}
          style={{ padding: '0.5rem 1rem' }}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
    </div>
  )
}
