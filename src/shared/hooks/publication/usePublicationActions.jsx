import React, { useState } from 'react'
import { data } from 'react-router-dom'
import { addPublicationRequest, deletePublicationRequest, updateImagePublicationRequest, updatePublicationRequest } from '../../../services/api'
import toast from 'react-hot-toast'

export const usePublicationActions = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const addPublication = async (data) => {
        setLoading(true)
        try {
            await addPublicationRequest(data)
            toast.success('Publicación agregada con éxito')
            setSuccess(true)
        } catch (error) {
            toast.error('Error al crear la publicación')
            setError('Error al crear la publicación')
        }finally{
            setLoading(false)
        }
    }

    const updatePublication = async(id, data) =>{
        setLoading(true)
        try {
            await updatePublicationRequest(id, data)
            toast.success('Publicación actualizada con éxito')
            setSuccess(true)
        } catch (error) {
            toast.error('Error al actualizar la publicación')
            setError('Error al actualizar la publicación')
        }finally{
            setLoading(false)
        }
    }

    const updateImagePublication = async (id, imageData)=>{
        setLoading(true)
        try {
            await updateImagePublicationRequest(id, imageData)
            toast.success('Publicación actualizada con éxito')
            setSuccess(true)
        } catch (error) {
            toast.error('Error al actualizar la publicación')
            setError('Error al actualizar la imagen')
        }finally{
            setLoading(false)
        }
    }

    const deletePublication = async (id) =>{
        setLoading(true)
        try {
            await deletePublicationRequest(id)
            toast.success('Publicación eliminada con éxito')
            setSuccess(true)
        } catch (error) {
            toast.error('Error al eliminar la publicación')
            setError('Error al eliminar la publicación')
        }finally{
            setLoading(false)
        }
    }

  return {
    addPublication,
    updatePublication,
    updateImagePublication,
    deletePublication,
    loading,
    error,
    success,
    setSuccess,
    setError
  }
}
