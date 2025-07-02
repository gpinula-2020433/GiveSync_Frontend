import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ListOfInstitutions.css';

import {
  getInstitutionsRequest,
  deleteInstitutionRequest
} from "../../../services/api";

export const ListOfInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta institución permanentemente?")) return

    const res = await deleteInstitutionRequest(id)
    if (!res.error) {
      toast.info("Institución eliminada.")
      setInstitutions(institutions.filter((i) => i._id !== id))
    } else {
      toast.error(res.message);
    }
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

        <table className="table table-hover table-bordered align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th style={{ width: "110px" }}>Imagen</th>
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

                <td>{inst.name}</td>
                <td>{inst.description}</td>
                <td className="text-uppercase text-center">{translateType(inst.type)}</td>
                <td className="text-uppercase text-center">{translateState(inst.state)}</td>

                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(inst._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}