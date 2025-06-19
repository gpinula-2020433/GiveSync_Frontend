import { useEffect, useState } from 'react';
import './DonationsToMyInstitution.css';

export const DonationsToMyInstitution = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3200/v1/donation/institution/my', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token // Sin "Bearer "
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error al obtener donaciones');

        setDonations(data.donations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p className="loading">Cargando donaciones...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="donations-container">
      <h2 className="title">Donaciones recibidas por tu institución</h2>
      {donations.length === 0 ? (
        <p className="empty">No se han recibido donaciones.</p>
      ) : (
        <div className="donation-list">
          {donations.map((donation) => (
            <div className="donation-card" key={donation._id}>
              <p className="icon-amount">
                <strong>Monto total:</strong> ${donation.amount.toFixed(2)}
              </p>
              <p className="icon-institution-amount">
                <strong>Para la institución:</strong> ${donation.institutionAmount.toFixed(2)}
              </p>
              <p className="icon-maintenance-amount">
                <strong>Para mantenimiento:</strong> ${donation.maintenanceAmount.toFixed(2)}
              </p>
              <p className="icon-date">
                <strong>Fecha:</strong> {new Date(donation.date).toLocaleDateString()}
              </p>
              {donation.userData && (
                <p className="icon-user">
                  <strong>Donante:</strong> {donation.userData.name} {donation.userData.surname} ({donation.userData.username})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
