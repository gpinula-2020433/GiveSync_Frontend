import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePublicationComments } from '../../shared/hooks/comments/usePublicationComments'
import { deleteComment, addComment, editComment } from '../../services/api'
import { CommentForm } from '../../components/comments/CommentForm'
import { useAuthenticatedUserContext } from '../../shared/hooks/User/useAuthenticatedUser'
import './CommentsPage.css'

export const CommentsPage = () => {
  const { publicationId } = useParams()
  const navigate = useNavigate()
  const { publication, comments: initialComments } = usePublicationComments(publicationId)
  const [comments, setComments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { user } = useAuthenticatedUserContext()

  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [publication?.imagePublication])

  const handleNewComment = async (formData) => {
    const result = await addComment(formData)
    if (!result.error) {
      setComments([result.comment, ...comments])
      setShowForm(false)
    }
    return result
  }

  const handleEditComment = async (id, formData) => {
    const result = await editComment(id, formData)
    if (!result.error) {
      setComments(comments.map(c => (c._id === id ? result.comment : c)))
      setEditData(null)
      setShowForm(false)
    }
    return result
  }

  const handleDeleteComment = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este comentario?')) return
    const res = await deleteComment(id)
    if (!res.error) {
      setComments(comments.filter(c => c._id !== id))
    } else {
      alert('Error al eliminar comentario')
    }
  }

  const handleEditClick = (comment) => {
    setEditData(comment)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditData(null)
    setShowForm(false)
  }

  const images = (typeof publication?.imagePublication === 'string'
    ? publication.imagePublication.split(',')
    : Array.isArray(publication?.imagePublication)
      ? publication.imagePublication
      : []
  )

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="comments-page">
      <button onClick={() => navigate(-1)} className="back-button">⬅️ Regresar</button>
      <h1>{publication?.title}</h1>

      {images.length > 0 && (
        <div className="carousel-container">
          <button onClick={prevImage} className="carousel-button left" aria-label="Imagen anterior">‹</button>
          <img
            src={`http://localhost:3200/uploads/img/users/${encodeURIComponent(images[currentImageIndex].trim())}`}
            alt={`Imagen ${currentImageIndex + 1}`}
            className="carousel-image"
            draggable={false}
          />
          <button onClick={nextImage} className="carousel-button right" aria-label="Imagen siguiente">›</button>
        </div>
      )}

      <button
        onClick={(e) => {
          if (!user) {
            e.preventDefault()
            alert('Debes iniciar sesión para poder comentar')
            return
          }
          setShowForm(!showForm)
          setEditData(null)
        }}
        className="toggle-form-button"
      >
        {showForm ? 'Cancelar comentario' : 'Agregar comentario'}
      </button>

      {showForm && (
        <CommentForm
          publicationId={publicationId}
          onNewComment={handleNewComment}
          onCancel={handleCancel}
          editCommentData={editData}
          onEditComment={handleEditComment}
        />
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No hay comentarios.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <small className="author">Por: {comment.userId?.name}</small>
              <p>{comment.content}</p>
              {comment.commentImage && (
                <img
                  src={`http://localhost:3200/uploads/img/users/${encodeURIComponent(comment.commentImage)}`}
                  alt="Imagen comentario"
                  className="comment-img"
                />
              )}
              <small className="date">
                {new Date(comment.createdAt || comment.fecha).toLocaleString()}
              </small>
              {user && user._id === comment.userId?._id && (
                <div className="comment-actions">
                  <button onClick={() => handleEditClick(comment)} className="edit-btn">Editar</button>
                  <button onClick={() => handleDeleteComment(comment._id)} className="delete-btn">Eliminar</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
