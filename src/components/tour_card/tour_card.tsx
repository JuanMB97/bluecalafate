import { Link } from 'react-router';
import './tour_card.css';
import type { TourCardProps } from '../../types';

function TourCard({
  title,
  image,
  tourCardImg,
  slug = '',
  logoIcon = 'fi fi-rr-compass',
  phrase = 'Te esperamos y te llevamos a tu destino',
  place,
  departureTime,
  pricePerPerson,
  serviceType = 'Servicio Compartido',
  hasPrivateOption = true,
}: TourCardProps) {
  // Priorizar tourCardImg para la miniatura de la tarjeta, con fallback a image
  const targetImg = tourCardImg || image || 'portada.jpg';

  const tourImgUrl =
    targetImg &&
    (targetImg.startsWith('http') ||
      targetImg.startsWith('/') ||
      targetImg.startsWith('blob:') ||
      targetImg.startsWith('data:'))
      ? targetImg
      : new URL(`../../assets/${targetImg || 'portada.jpg'}`, import.meta.url).href;

  const targetSlug = slug ? `/tours/${slug}` : '#';

  return (
    <div className="box-tour-container">
      {/* Header Media */}
      <div className="tour-card-media">
        <img src={tourImgUrl} alt={title || 'Tour'} className="tour-img" loading="lazy" />
        <div className="tour-media-overlay" />

        {/* Badges superiores sobre la imagen */}
        <div className="tour-card-badges">
          {serviceType && (
            <span className="tour-badge-service">
              <i className="fi fi-rr-shield-check"></i>
              <span>{serviceType}</span>
            </span>
          )}
          {hasPrivateOption !== false && (
            <span className="tour-badge-private" title="Servicio Privado VIP disponible">
              <i className="fi fi-sr-crown"></i>
              <span>Privado VIP</span>
            </span>
          )}
        </div>

        {/* Logo / Icono flotante descriptivo */}
        <div className="tour-logo">
          <i className={logoIcon}></i>
        </div>
      </div>

      {/* Contenido / Información del Tour */}
      <div className="tour-info">
        {place && (
          <div className="tour-card-location">
            <i className="fi fi-rr-marker"></i>
            <span>{place}</span>
          </div>
        )}

        <h3 className="tour-card-title">{title || 'Título del Tour'}</h3>

        {phrase && <p className="tour-card-description">{phrase}</p>}

        {/* Especificaciones rápidas de Capacidad y Horarios */}
        <div className="tour-card-specs">
          <div className="tour-spec-item" title="Capacidad estándar del servicio">
            <i className="fi fi-sr-users-alt"></i>
            <span>
              Capacidad: <strong>Hasta 4 personas</strong>{' '}
              <span className="tour-spec-subnote">(+4 consultar)</span>
            </span>
          </div>

          <div className="tour-spec-item" title="Diferencia de horarios entre modalidades">
            <i className="fi fi-rr-clock"></i>
            <span>
              Horarios: <strong>{departureTime ? `${departureTime} (fijo)` : 'Fijo'}</strong> /{' '}
              <strong className="text-gold-spec">A elección (Privado)</strong>
            </span>
          </div>
        </div>

        {/* Footer con precio y botón de acción */}
        <div className="tour-card-footer">
          <div className="tour-price-box">
            <span className="tour-price-label">Desde (Base 4 pax)</span>
            <span className="tour-price-value">
              {pricePerPerson || 'Consultar'}
            </span>
          </div>

          <div className="box-tour-button">
            <Link to={targetSlug} className="btn-tour-link">
              <span>Ver más</span>
              <i className="fi fi-bs-arrow-circle-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TourCard };
export default TourCard;