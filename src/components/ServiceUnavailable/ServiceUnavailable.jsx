import { useNavigate } from 'react-router-dom';
import './ServiceUnavailable.css'; // Asegúrate de tener un archivo CSS para estilos
export const ServiceUnavailable = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // o a la ruta principal que tengas
  };

  return (
    <div className="service-container">
      <h1>Error 503</h1>
      <h2>Servicio no disponible</h2>
      <p>El servidor no puede procesar la solicitud en este momento...</p>
      <ul>
        <li>🔁 Intenta actualizar la página más tarde.</li>
        <li>🛠️ Puede que el sitio esté en mantenimiento.</li>
        <li>💻 Si eres el administrador, revisa los servicios del servidor.</li>
      </ul>
      <button onClick={handleGoHome}>Volver al inicio</button>
    </div>
  );
};
