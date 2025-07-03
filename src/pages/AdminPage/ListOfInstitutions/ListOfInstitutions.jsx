import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ListOfInstitutions.css';

import {
  getInstitutionsRequest,
  deleteInstitutionRequest,
  generateExcel
} from "../../../services/api";

export const ListOfInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getInstitutionsRequest();
      if (!res.error) setInstitutions(res);
      else toast.error(res.message);
      setLoading(false);
    })()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getInstitutionsRequest()
      if (!res.error) setInstitutions(res)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDeleteClick = (id) => {
    setInstitutionToDelete(id);
    setShowModal(true);
  }

  const confirmDelete = async () => {
    if (!institutionToDelete) return;

    const res = await deleteInstitutionRequest(institutionToDelete);
    if (!res.error) {
      toast.info("Institución eliminada.");
      setInstitutions(institutions.filter((i) => i._id !== institutionToDelete));
    } else {
      toast.error(res.message);
    }

    setShowModal(false);
    setInstitutionToDelete(null);
  }

  const translateType = (type) => {
    const map = {
      ORPHANAGE: 'ORFANATO',
      EATERS: 'COMEDOR',
      ACYL: 'ASILO',
    }
    return map[type] || type;
  }

  const translateState = (state) => {
    const map = {
      ACCEPTED: 'ACEPTADO',
      EARRING: 'PENDIENTE',
      REFUSED: 'RECHAZADO'
    }
    return map[state] || state
  }

  if (loading) return <div className="container mt-4">Cargando...</div>

  return (
    <div className="list-institutions-page">
      <div className="container mt-4">
        <ToastContainer position="top-right" autoClose={2500} />
        <h2 className="fw-bold mb-3">Todas las instituciones</h2>
        <button className="btn btn-success" onClick={generateExcel}>
          Descargar Excel
        </button>
        <table className="table table-hover table-bordered align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th style={{ width: "110px" }}>Imagen</th>
              <th>Usuario / Correo</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th style={{ width: "90px" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {institutions.map((inst) => (
              <tr key={inst._id}>
                <td className="text-center">
                  {inst.imageInstitution?.length ? (
                    <img
                      src={`/uploads/img/users/${inst.imageInstitution[0]}`}
                      alt={inst.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "75px" }}
                    />
                  ) : (
                    <span className="text-muted">Sin&nbsp;imagen</span>
                  )}
                </td>
                <td>
                  {inst.userId ?
                    <>
                      <strong>{inst.userId.name} {inst.userId.surname}</strong><br />
                      <small className="text-muted">{inst.userId.email}</small>
                    </>
                    : 'Sin datos'}
                </td>
                <td>{inst.name}</td>
                <td>{inst.description}</td>
                <td className="text-uppercase text-center">{translateType(inst.type)}</td>
                <td className="text-uppercase text-center">{translateState(inst.state)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(inst._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de Confirmación */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar esta institución permanentemente?</p>
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
    </div>
  )
}