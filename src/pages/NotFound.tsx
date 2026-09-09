import { Link } from 'react-router';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">
        404
      </h1>
      <h2 className="notfound-subtitle">
        Página no encontrada
      </h2>
      <p className="notfound-text">
        La página que buscas no existe o ha sido movida. Explora nuestros servicios o vuelve al inicio.
      </p>
      <Link
        to="/"
        className="notfound-btn"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}

export default NotFound;
