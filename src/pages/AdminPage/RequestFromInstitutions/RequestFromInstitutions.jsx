import React, { useEffect, useState } from 'react';
import './RequestFromInstitutions.css';
import { CheckCircle, XCircle } from 'lucide-react';

export const RequestFromInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3200/v1/institution/pending', {
        headers: { Authorization: token }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al obtener instituciones');
      setInstitutions(data.institutions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateState = async (id, newState) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3200/v1/institution/${id}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ state: newState })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar estado');

      // Quita la institución aceptada/rechazada de la lista
      setInstitutions(prev => prev.filter(inst => inst._id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error: {error}</p>;
  if (institutions.length === 0) return <p>No hay solicitudes pendientes.</p>;

  return (
    <div className="request-institutions-container">
      <h2>Solicitudes de Instituciones Pendientes</h2>
      <ul className="institution-list">
        {institutions.map(inst => (
          <li key={inst._id} className="institution-card">
            <h3>{inst.name}</h3>

            {inst.imageInstitution?.[0] && (
              <img
                src={`http://localhost:3200/institutions/${inst.imageInstitution[0]}`}
                alt={inst.name}
                className="institution-image"
              />
            )}

            <p><strong>Tipo:</strong> {inst.type}</p>
            <p><strong>Descripción:</strong> {inst.description}</p>

            <div className="buttons">
              <button onClick={() => updateState(inst._id, 'ACCEPTED')} className="accept-btn">
                <CheckCircle size={18} /> Aceptar
              </button>
              <button onClick={() => updateState(inst._id, 'REFUSED')} className="reject-btn">
                <XCircle size={18} /> Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};