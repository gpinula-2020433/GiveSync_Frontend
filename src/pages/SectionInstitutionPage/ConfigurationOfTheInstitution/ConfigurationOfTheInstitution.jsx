/* import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getMyInstitutionsRequest,
  updateInstitutionRequest,
  updateInstitutionImageRequest,
  deleteInstitutionRequest
} from "../../../services/api"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import './ConfigurationOfTheInstitution.css'

export const ConfigurationOfTheInstitution = () => {
  const [institution, setInstitution] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  })
  const [imagesPreview, setImagesPreview] = useState([])
  const [images, setImages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const res = await getMyInstitutionsRequest()
      if (!res.error && res.institutions?.length > 0) {
        const inst = res.institutions[0]
        setInstitution(inst)
        setFormData({
          name: inst.name,
          type: inst.type,
          description: inst.description,
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

  const handleDelete = async () => {
    if (!institution) return
    if (!confirm("¿Estás seguro de que deseas eliminar tu institución?")) return

    await deleteInstitutionRequest(institution._id)
    toast.info("Institución eliminada.")
    setTimeout(() => navigate("/institutions"), 1500)
  }

  if (!institution) return <p className="container mt-4">Cargando institución...</p>

  return (
    <div className="config-institution container py-4">
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
            <option value="EATERS">EATERS</option>
            <option value="ORPHANAGE">ORPHANAGE</option>
            <option value="ACYL">ACYL</option>
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
          <button className="btn btn-danger" onClick={handleDelete}>
            Eliminar institución
          </button>
        </div>
      </div>
    </div>
  )
} */
// src/pages/ConfigurationOfTheInstitution.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyInstitutionsRequest,
  updateInstitutionRequest,
  updateInstitutionImageRequest,
  deleteInstitutionRequest
} from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ConfigurationOfTheInstitution.css";

export const ConfigurationOfTheInstitution = () => {
  const [institution, setInstitution] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", description: "" });
  const [imagesPreview, setImagesPreview] = useState([]);      // URLs de imágenes actuales en servidor
  const [imagesToDelete, setImagesToDelete] = useState([]);     // Nombres marcados para borrar
  const [newImages, setNewImages] = useState([]);               // Archivos recién seleccionados
  const navigate = useNavigate();

  /* ─────────────── Obtener institución del usuario ─────────────── */
  useEffect(() => {
    (async () => {
      const res = await getMyInstitutionsRequest();
      if (!res.error && res.institutions?.length > 0) {
        const inst = res.institutions[0];
        setInstitution(inst);
        setFormData({ name: inst.name, type: inst.type, description: inst.description });
        setImagesPreview(inst.imageInstitution || []);
      }
    })();
  }, []);

  /* ─────────────── Handlers ─────────────── */
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setNewImages([...e.target.files]);

  const handleRemovePreview = (img) => {
    setImagesPreview(imagesPreview.filter((i) => i !== img));
    setImagesToDelete([...imagesToDelete, img]);
  };

  /* ─────────────── UPDATE ─────────────── */
  const handleUpdate = async () => {
    if (!institution) return;

    try {
      await updateInstitutionRequest(institution._id, formData);

      const formImg = new FormData();
      newImages.forEach((file) => formImg.append("imageInstitution", file));
      formImg.append("keep", JSON.stringify(imagesPreview));
      formImg.append("remove", JSON.stringify(imagesToDelete));

      await updateInstitutionImageRequest(institution._id, formImg);
      toast.success("Institución actualizada correctamente.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Error al actualizar la institución.");
    }
  };

  /* ─────────────── DELETE ─────────────── */
  const handleDelete = async () => {
    if (!institution) return;
    if (!confirm("¿Estás seguro de que deseas eliminar tu institución?")) return;

    try {
      await deleteInstitutionRequest(institution._id);
      toast.info("Institución eliminada.");
      setTimeout(() => navigate("/institutions"), 1500);
    } catch (err) {
      toast.error("No se pudo eliminar la institución.");
    }
  };

  if (!institution) return <p className="container mt-4">Cargando institución...</p>;

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
            <option value="EATERS">EATERS</option>
            <option value="ORPHANAGE">ORPHANAGE</option>
            <option value="ACYL">ACYL</option>
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
          <label className="form-label">Añadir nuevas imágenes</label>
          <input type="file" multiple className="form-control" onChange={handleImageChange} />
        </div>

        {imagesPreview.length > 0 && (
          <div className="row g-3 mb-4">
            {imagesPreview.map((img) => (
              <div className="col-6 col-md-3 position-relative" key={img}>
                <button
                  type="button"
                  className="btn-close btn-close-white preview-remove"
                  onClick={() => handleRemovePreview(img)}
                  aria-label="Eliminar"
                />
                <img
                  src={`/uploads/img/users/${img}`}
                  alt={img}
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
          <button className="btn btn-danger" onClick={handleDelete}>
            Eliminar institución
          </button>
        </div>
      </div>
    </div>
  );
};
