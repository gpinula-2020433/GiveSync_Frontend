import React, { useState } from 'react'
import { data } from 'react-router-dom'
import { addPublicationRequest, deletePublicationRequest, updateImagePublicationRequest, updatePublicationRequest } from '../../../services/api'

export const usePublicationActions = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const addPublication = async (data) => {
        setLoading(true)
        try {
            await addPublicationRequest(data)
            setSuccess(true)
        } catch (error) {
            setError('Error al crear la publicación')
        }finally{
            setLoading(false)
        }
    }

    const updatePublication = async(id, data) =>{
        setLoading(true)
        try {
            await updatePublicationRequest(id, data)
            setSuccess(true)
        } catch (error) {
            setError('Error al actualizar la publicación')
        }finally{
            setLoading(false)
        }
    }

    const updateImagePublication = async (id, imageData)=>{
        setLoading(true)
        try {
            await updateImagePublicationRequest(id, imageData)
            setSuccess(true)
        } catch (error) {
            setError('Error al actualizar la imagen')
        }finally{
            setLoading(false)
        }
    }

    const deletePublication = async (id) =>{
        setLoading(true)
        try {
            await deletePublicationRequest(id)
            setSuccess(true)
        } catch (error) {
            setError('Error al eliminar la publicación')
        }finally{
            setLoading(false)
        }
    }

  return (
    addPublication,
    updatePublication,
    updateImagePublication,
    deletePublication,
    loading,
    error,
    success,
    setSuccess,
    setError
  )
}
