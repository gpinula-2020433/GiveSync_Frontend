import { config } from "@fortawesome/fontawesome-svg-core"
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

const apiReport = axios.create({
  baseURL: 'http://localhost:3200/v1',
  timeout: 2000
})

apiReport.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem('token')
    if(token){
      config.headers.Authorization = token
    }
    return config
  }
)

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
  if (token) config.headers.Authorization = token
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
    // Retornamos la respuesta de manera más detallada
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al registrar institución'
    }
  }
}



// Obtener instituciones del usuario autenticado
export const getMyInstitutionsRequest = async () => {
  try {
    const res = await apiInstitucion.get('/my')
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al obtener las instituciones'
    }
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
    if (err.response && err.response.status === 404) {
      // No hay instituciones, devuelve estructura válida pero vacía
      return {
        success: true,
        institutions: []
      }
    }
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
    return response.data.user
  } catch (err) {
    // Captura el mensaje del backend si existe
    const backendMessage = err?.response?.data?.message || 'Error desconocido'
    return { error: true, message: backendMessage }
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

// services/api.js
export const getAllUsersRequest = async ({ limit = 10, skip = 0 } = {}) => {
  try {
    const response = await apiClient.get('/v1/user/getAllUsersADMIN', {
      params: { limit, skip }
    });
    return response.data;
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    return { error: true, message: 'Error al obtener usuarios' };
  }
};


// services/api.js
export const getMyNotificationsRequest = async () => {
  try {
    const res = await apiClient.get('/v1/notification/my')
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al obtener notificaciones',
      errors: err.response?.data?.errors || null
    }
  }
}

export const markNotificationAsReadRequest = async (id) => {
  try {
    const res = await apiClient.put(`/v1/notification/markAsRead/${id}`)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al marcar como leída'
    }
  }
}

export const deleteNotificationRequest = async (id) => {
  try {
    const res = await apiClient.delete(`/v1/notification/delete/${id}`)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Error al eliminar notificación'
    }
  }
}

// ✅ services/institutionService.js
export const fetchPendingInstitutions = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3200/v1/institution/pending', {
      headers: { Authorization: token }
    })
    const data = await res.json()
    return { status: res.ok, data }
  } catch (error) {
    console.error('Error al obtener instituciones:', error)
    return { status: false, data: { message: 'Error al obtener instituciones' } }
  }
}

export const updateInstitutionState = async (id, newState) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3200/v1/institution/updateState/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ state: newState })
    })
    const data = await res.json()
    return { status: res.ok, data }
  } catch (error) {
    console.error('Error al actualizar estado:', error)
    return { status: false, data: { message: 'Error al actualizar estado' } }
  }
}

//Generar excel
export const generateExcel = async ()=>{
  try {
    const response = await apiReport.get('/export-excel',{
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'instituciones.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()

    return {success: true}
  } catch (error) {
    console.error('Error al generar excel')
    return { error: true, message: 'Error al generar excel' }
  }
}