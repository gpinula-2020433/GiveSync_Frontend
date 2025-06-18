import { useEffect, useState } from 'react'
import { getCommentsByPublicationRequest, getPublicationByIdRequest } from '../../../services/api'

export const usePublicationComments = (publicationId) => {
  const [publication, setPublication] = useState(null)
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (!publicationId) return

    const fetchPublication = async () => {
      try {
        const data = await getPublicationByIdRequest(publicationId)
        console.log('data publication:', data)

        if (data?.publication) {
          setPublication(data.publication)
        } else {
          setPublication(null)
        }
      } catch (err) {
        console.error('Error al obtener publicación', err)
        setPublication(null)
      }
    }

    const fetchComments = async () => {
      try {
        const data = await getCommentsByPublicationRequest(publicationId)
        console.log('data comments:', data)

        if (Array.isArray(data?.comments)) {
          setComments(data.comments)
        } else {
          setComments([])
        }
      } catch (err) {
        console.error('Error al obtener comentarios', err)
        setComments([])
      }
    }

    fetchPublication()
    fetchComments()
  }, [publicationId])

  return { publication, comments }
}
