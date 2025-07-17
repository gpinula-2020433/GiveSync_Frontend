import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublicationComments } from '../../shared/hooks/comments/usePublicationComments';
import { deleteComment, addComment, editComment } from '../../services/api';
import { CommentForm } from '../../components/comments/CommentForm';
import { useAuthenticatedUser } from '../../shared/hooks/User/useAuthenticatedUser';
import './CommentsPage.css';

export const CommentsPage = () => {
  const { publicationId } = useParams();
  const navigate = useNavigate();
  const { publication, comments: initialComments } = usePublicationComments(publicationId);
  const [comments, setComments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const { user } = useAuthenticatedUser();
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleNewComment = async (formData) => {
    if (formData.content.length > 500) {
      setError('El comentario no puede superar los 500 caracteres.');
      return;
    }
    const result = await addComment(formData);
    if (!result.error) {
      setComments([result.comment, ...comments]);
      setShowForm(false);
      setError('');
      return result;
    }
    return result;
  };

  const handleEditComment = async (id, formData) => {
    if (formData.content.length > 500) {
      setError('El comentario no puede superar los 500 caracteres.');
      return;
    }
    const result = await editComment(id, formData);
    if (!result.error) {
      setComments(comments.map((c) => (c._id === id ? result.comment : c)));
      setEditData(null);
      setShowForm(false);
      setError('');
    }
    return result;
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este comentario?')) return;
    const res = await deleteComment(id);
    if (!res.error) {
      setComments(comments.filter((c) => c._id !== id));
    } else {
      alert('Error al eliminar comentario');
    }
  };

  const handleEditClick = (comment) => {
    setEditData(comment);
    setShowForm(true);
    setCommentContent(comment.content); // Cargar contenido para editar
  };

  const handleCancel = () => {
    setEditData(null);
    setShowForm(false);
    setCommentContent(''); // Limpiar el contenido del comentario
  };

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Debes iniciar sesión para ver detalles');
    }
  };

  return (
    <div className="comments-page">
      <button onClick={() => navigate(-1)} className="back-button">⬅️ Regresar</button>
      <h1>{publication?.title}</h1>

      {publication?.imagePublication && (
        <div className="publication-images">
          {(typeof publication.imagePublication === 'string'
            ? publication.imagePublication.split(',')
            : Array.isArray(publication.imagePublication)
            ? publication.imagePublication
            : []
          ).map((img, i) => (
            <img
              key={i}
              src={`http://localhost:3200/uploads/img/users/${encodeURIComponent(img.trim())}`}
              alt={`Imagen ${i + 1}`}
              className="publication-img"
            />
          ))}
        </div>
      )}

      <button
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            alert('Debes iniciar sesión para poder comentar');
            return;
          }
          setShowForm(!showForm);
          setEditData(null);
          setCommentContent(''); // Limpiar contenido para agregar nuevo comentario
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
          commentContent={commentContent} // Pasar el contenido
          setCommentContent={setCommentContent} // Actualizar el contenido
        />
      )}

      {/* Mostrar mensaje de error si el comentario excede los 500 caracteres */}
      {error && <p className="error-message">{error}</p>}

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
                  <button onClick={() => handleEditClick(comment)} className="edit-btn">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteComment(comment._id)} className="delete-btn">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
