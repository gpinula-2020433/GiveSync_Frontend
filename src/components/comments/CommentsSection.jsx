import React, { useEffect, useState } from 'react'

// Componente para mostrar comentarios y formulario para añadir
const CommentsSection = ({ publicationId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Función para cargar comentarios (simulación, cambia según tu API)
  const fetchComments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/comments/publication/${publicationId}`)
      const data = await res.json()
      setComments(data)
    } catch (err) {
      setError('Error al cargar comentarios')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [publicationId])

  // Función para agregar comentario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await fetch(`/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicationId, content: newComment }),
      })
      if (!res.ok) throw new Error('Error al enviar comentario')

      setNewComment('')
      setShowForm(false)
      fetchComments() // Recarga comentarios
    } catch {
      alert('No se pudo enviar el comentario')
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setShowForm((prev) => !prev)} style={{ marginBottom: 10 }}>
        {showForm ? 'Cancelar' : 'Añadir comentario'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            placeholder="Escribe tu comentario..."
          />
          <button type="submit">Comentar</button>
        </form>
      )}

      {loading ? (
        <p>Cargando comentarios...</p>
      ) : error ? (
        <p>{error}</p>
      ) : comments.length === 0 ? (
        <p>No hay comentarios</p>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {comments.map((c) => (
            <li key={c._id} style={{ borderBottom: '1px solid #ccc', marginBottom: 5, paddingBottom: 5 }}>
              <p>{c.content}</p>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentsSection
