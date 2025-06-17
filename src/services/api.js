import axios from "axios"

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