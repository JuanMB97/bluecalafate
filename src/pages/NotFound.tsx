import { Link } from 'react-router';

export function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '120px 20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '96px',
          fontWeight: 800,
          color: '#0d47ff',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '28px', color: '#0a1445', margin: '16px 0 8px' }}>
        Página no encontrada
      </h2>
      <p style={{ color: '#64748b', maxWidth: '500px', marginBottom: '32px' }}>
        La página que buscas no existe o ha sido movida. Explora nuestros servicios o vuelve al inicio.
      </p>
      <Link
        to="/"
        style={{
          background: '#0d47ff',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(13, 71, 255, 0.25)',
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
}

export default NotFound;
