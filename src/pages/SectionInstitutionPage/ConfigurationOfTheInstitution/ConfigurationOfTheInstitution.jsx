import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getMyInstitutionsRequest,
  updateInstitutionRequest,
  updateInstitutionImageRequest,
  deleteInstitutionRequest
} from "../../../services/api"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import './ConfigurationOfTheInstitution.css'

export const ConfigurationOfTheInstitution = () => {
  const [institution, setInstitution] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    phone: ""
  })
  const [imagesPreview, setImagesPreview] = useState([])
  const [images, setImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions?.length > 0) {
        const inst = res.institutions[0]
        setInstitution(inst)
        setFormData({
          name: inst.name,
          type: inst.type || 'EATERS',
          description: inst.description,
          address: inst.address,
          phone: inst.phone
        })
        setImagesPreview(inst.imageInstitution || [])
      }
    })()
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setImages([...e.target.files])
  }

  const handleUpdate = async () => {
    if (!institution) return

    await updateInstitutionRequest(institution._id, formData)

    if (images.length > 0) {
      const formImg = new FormData();
      images.forEach((img) => formImg.append("imageInstitution", img))
      await updateInstitutionImageRequest(institution._id, formImg)
    }

    toast.success("Institución actualizada correctamente.")
    setTimeout(() => window.location.reload(), 1500)
  }

  const confirmDelete = async () => {
    if (!institution) return
    await deleteInstitutionRequest(institution._id)
    toast.info("Institución eliminada.")
    setInstitution(null)
    setShowModal(false)
    setTimeout(() => navigate("/main/home"), 1500)
  }

  if (!institution) return (
    <div className="container mt-4">
      <p>Cargando institución... o No tienes ninguna institución registrada actualmente.</p>
    </div>
  )

  return (
    <div className="config-institution container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="config-institution-form">
        <h2 className="fw-bold mb-3">Editar Institución</h2>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un tipo</option>
            <option value="EATERS">COMEDOR</option>
            <option value="ORPHANAGE">ORFANATO</option>
            <option value="ACYL">ASILO</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Actualizar Imágenes</label>
          <input
            type="file"
            multiple
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {imagesPreview.length > 0 && (
          <div className="row g-3 mb-4">
            {imagesPreview.map((img, i) => (
              <div className="col-6 col-md-3" key={i}>
                <img
                  src={`/uploads/img/users/${img}`}
                  alt={`img-${i}`}
                  className="img-fluid rounded shadow-sm"
                />
              </div>
            ))}
          </div>
        )}

        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Guardar cambios
          </button>
          <button className="btn btn-danger" onClick={() => setShowModal(true)}>
            Eliminar institución
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">¿Eliminar institución?</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar tu institución de forma permanente?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  )
}