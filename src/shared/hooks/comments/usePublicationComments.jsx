import { useEffect, useState, useCallback } from 'react'
import { getCommentsByPublicationRequest, getPublicationByIdRequest } from '../../../services/api'
import { useSocket } from '../useSocket'  // tu hook personalizado para socket.io

export const usePublicationComments = (publicationId) => {
  const [publication, setPublication] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar publicación y comentarios
  const fetchData = useCallback(async () => {
    if (!publicationId) return

    setLoading(true)
    try {
      const pubData = await getPublicationByIdRequest(publicationId)
      if (pubData?.publication) {
        setPublication(pubData.publication)
      } else {
        setPublication(null)
      }

      const commData = await getCommentsByPublicationRequest(publicationId)
      if (Array.isArray(commData?.comments)) {
        setComments(commData.comments)
      } else {
        setComments([])
      }
      setError(null)
    } catch (err) {
      setError('Error al obtener datos')
      setPublication(null)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [publicationId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Escuchar nuevos comentarios
  useSocket('addComment', ({ comment, publicationId: pubId }) => {
    if (pubId === publicationId) {
      setComments(prev => [comment, ...prev])
    }
  })

  // Escuchar comentarios actualizados
  useSocket('updateComment', ({ comment, publicationId: pubId }) => {
    if (pubId === publicationId) {
      setComments(prev =>
        prev.map(c => (c._id === comment._id ? comment : c))
      )
    }
  })

  // Escuchar comentarios eliminados
  useSocket('deleteComment', ({ commentId, publicationId: pubId }) => {
    if (pubId === publicationId) {
      setComments(prev => prev.filter(c => c._id !== commentId))
    }
  })

  return { publication, comments, loading, error, refetch: fetchData }
}
