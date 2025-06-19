import axios from "axios"
import { data } from "react-router-dom"

const apiClient = axios.create(
    {
        baseURL: 'http://localhost:3200',
        timeout: 2000
    }
)

const apiInstitucion = axios.create(
    {
        baseURL: 'http://localhost:3200/v1/institution',
        timeout: 2000
    }
)

const apiPublication = axios.create(
  {
      baseURL: 'http://localhost:3200/v1/publication',
      timeout: 2000
  }
)


const apiComment = axios.create({
  baseURL: 'http://localhost:3200/v1/comment',
  timeout: 2000
})





apiClient.interceptors.request.use(
    (config)=> {
        const token = localStorage.getItem('token')
        if(token) {
            config.headers.Authorization = token
        }
        return config
    }
)

apiInstitucion.interceptors.request.use(
    (config)=> {
        const token = localStorage.getItem('token')
        if(token) {
            config.headers.Authorization = token
        }
        return config
    }
)

apiComment.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiPublication.interceptors.request.use(
  (config)=> {
    const token = localStorage.getItem('token')
    if(token){
      config.headers.Authorization = token
    }
    return config
  }
)

export const loginRequest = async(userLoginData)=>{
    try {
        return await apiClient.post('/login', userLoginData, {
            type: 'multipart/form-data'
        })
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const registerRequest = async(user)=> {
    try{
        return await apiClient.post('/register', user,{ 
            type: 'multipart/form-data'
        })
    }catch(err){
        return {
            error: true,
            err
        }
    }
}


//Agregar institución
export const createInstitutionRequest = async (data) => {
  try {
    const res = await apiInstitucion.post('/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


// Obtener instituciones del usuario autenticado
export const getMyInstitutionsRequest = async () => {
  try {
    const res = await apiInstitucion.get('/my')
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


//Listar todas las instituciones
export const getInstitutionsRequest = async () => {
  try {
    const res = await apiInstitucion.get("/all")
    return res.data?.institutions || []
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || "Error al cargar" }
  }
}

//Actualizar institución
export const updateInstitutionRequest = async (id, data) => {
  try {
    const res = await apiInstitucion.put(`/update/${id}`, data)
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


//Actualizar imagen de institución
export const updateInstitutionImageRequest = async (id, data) => {
  try {
    const res = await apiInstitucion.put(`/updateImage/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


//Eliminar institución
export const deleteInstitutionRequest = async (id) => {
  try {
    const res = await apiInstitucion.delete(`/delete/${id}`)
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}

//ruta para el home donde se mostraran las instituciones acpetadas

export const getAcceptedInstitutions = async () => {
  try {
    const res = await apiClient.get('/v1/institution/all?state=ACCEPTED')
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}

export const getInstitutionById = async (id) => {
  try {
    const res = await apiClient.get(`/v1/institution/${id}`)
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}

//listar publicaciones por institución
export const getPublicationsByInstitutionRequest = async (institutionId, data)=>{
  try {
    const res = await apiPublication.get(`/getByInstitution/${institutionId}`, data)
    return res
  } catch (error) {
    return {error: true, error}
  }
}

export const addPublicationRequest = async (data) =>{
  return await apiPublication.post(`/add`, data)
}

export const updatePublicationRequest = async (id, data) =>{
  return await apiPublication.put(`/update/${id}`, data)
}

export const updateImagePublicationRequest = async (id, data) =>{
  try {
    const res = await apiPublication.put(`/updateImage/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error) {
    return { error: true, error}
  }
}

export const deletePublicationRequest = async (id)=>{
  return await apiPublication.delete(`/delete/${id}`)
}

//listar publicaciones por id
export const getPublicationByIdRequest = async (id) => {
  try {
    const res = await apiPublication.get(`/${id}`)
    return res.data // ✔️ esto es lo que espera tu fetch
  } catch (err) {
    return { error: true, err }
  }
}

export const getCommentsByPublicationRequest = async (publicationId) => {
  try {
    const res = await apiComment.get(`/publication/${publicationId}`)
    return res.data // ✔️ esto también
  } catch (err) {
    return { error: true, err }
  }
}

export const getCommentsByPublication = async (req, res) => {
  try {
    const { publicationId } = req.params
    const comments = await apiComment.find({ publicationId })
      .populate('userId', 'name email')
      .populate('publicationId', '-institutionId') // <-- aquí el cambio

    if (comments.length === 0)
      return res.status(404).send({ success: false, message: 'No hay comentarios para esta publicación' })

    return res.send({ success: true, comments })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ success: false, message: 'Error del servidor', err })
  }
}


export const addComment = async (data) => {
  try {
    const res = await apiComment.post('/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


export const deleteComment = async (id)=>{
  try{
    const res = await apiComment.delete(`/${id}`)
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}

export const editComment = async (id, data) => {
  try {
    const res = await apiComment.put(`/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    return { error: true, err }
  }
}


export const getAuthenticatedUserRequest = async () => {
  try {
    const response = await apiClient.get('/v1/user/getAuthenticatedClient/')
    // Accede directamente a `response.data.user`
    return response.data.user
  } catch (err) {
    console.error('API error:', err)
    return { error: true, err }
  }
}


export const updateUserImageRequest = async (formData) => {
  try {
    const res = await apiClient.put('/v1/user/updateUserImageClient/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al actualizar imagen'
    }
  }
}

export const deleteUserImageRequest = async () => {
  try {
    const res = await apiClient.delete('/v1/user/deleteUserImageClient/')
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al eliminar imagen'
    }
  }
}

export const updateUserRequest = async (data) => {
  try {
    const res = await apiClient.put('/v1/user/updateClient/', data)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al actualizar usuario',
      errors: err.response?.data?.errors || null
    }
  }
}

export const deleteUserAccountRequest = async (password) => {
  try {
    const res = await apiClient.delete('/v1/user/deleteClient', {
      data: { password }  // enviar el body en DELETE
    })
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al eliminar cuenta'
    }
  }
}

export const updatePasswordRequest = async ({ currentPassword, newPassword }) => {
  try {
    const res = await apiClient.put('/v1/user/updatePassword/', { currentPassword, newPassword })
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al actualizar la contraseña'
    }
  }
}