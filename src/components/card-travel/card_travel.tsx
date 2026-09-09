import type { CardTravelProps } from '../../types';
import './card_travel.css';

/**
 * Retorna un nombre de categoría descriptivo según la capacidad si no se especifica nombre.
 */
function getDefaultVehicleName(capacity: number): string {
  if (capacity <= 4) return 'Sedán Ejecutivo Confort';
  if (capacity <= 8) return 'Van Ejecutiva / Miniván';
  if (capacity <= 15) return 'Minibús Turístico';
  return 'Bus / Minibús Grupal';
}

/**
 * Retorna una descripción breve según la capacidad si no se especifica una personalizada.
 */
function getDefaultDescription(capacity: number): string {
  if (capacity <= 4) {
    return 'Ideal para traslados privados y parejas con máximo confort y agilidad.';
  }
  if (capacity <= 8) {
    return 'Amplio espacio y comodidad para familias y grupos reducidos con equipaje.';
  }
  if (capacity <= 15) {
    return 'Unidad ágil y confortable para contingentes medianos y excursiones.';
  }
  return 'Vehículo de gran porte diseñado para traslados grupales de larga distancia.';
}

export function CardTravel({
  img,
  capacidad,
  name,
  luggageCapacity,
  description,
}: CardTravelProps) {
  // Resuelve la URL de la imagen (URL remota, asset local o data URI)
  const vehicleImgUrl =
    img &&
    (img.startsWith('http') ||
      img.startsWith('/') ||
      img.startsWith('data:') ||
      img.startsWith('blob:'))
      ? img
      : new URL(`../../assets/${img || 'portada_car.jpeg'}`, import.meta.url).href;

  const vehicleName = name?.trim() || getDefaultVehicleName(capacidad);
  const vehicleDesc = description?.trim() || getDefaultDescription(capacidad);
  const luggageCount = luggageCapacity ?? capacidad;

  return (
    <div className="card-travel-container">
      {/* Escenario / Stage visual del vehículo */}
      <div className="card-travel-stage">
        <div className="card-travel-stage-glow" />

        {/* Badges superiores */}
        <div className="card-travel-stage-badges">
          <span className="card-travel-badge-fleet">
            <i className="fi fi-rr-car-alt"></i>
            <span>Flota Oficial</span>
          </span>
          <span className="card-travel-badge-capacity">
            <i className="fi fi-rr-users-alt"></i>
            <span>{capacidad} Pasajeros</span>
          </span>
        </div>

        {/* Imagen del vehículo con animación de elevación */}
        <div className="card-travel-img-wrap">
          <img
            src={vehicleImgUrl}
            alt={vehicleName}
            className="card-travel-img"
            loading="lazy"
          />
        </div>

        {/* Insignia circular decorativa que conecta con el estilo de TourCard */}
        <div className="card-travel-floating-badge" title="Unidad Verificada">
          <i className="fi fi-rr-shield-check"></i>
        </div>
      </div>

      {/* Información y Ficha Técnica de la Unidad */}
      <div className="card-travel-content">
        <div className="card-travel-header">
          <span className="card-travel-category-tag">UNIDAD DE TRASLADO</span>
          <h3 className="card-travel-title">{vehicleName}</h3>
          <p className="card-travel-description">{vehicleDesc}</p>
        </div>

        {/* Ficha de Especificaciones Principales */}
        <div className="card-travel-specs-grid">
          <div className="card-travel-spec-item">
            <div className="spec-icon-box">
              <i className="fi fi-rr-users"></i>
            </div>
            <div className="spec-info">
              <span className="spec-label">Capacidad</span>
              <span className="spec-val">Hasta <strong>{capacidad}</strong> personas</span>
            </div>
          </div>

          <div className="card-travel-spec-item">
            <div className="spec-icon-box">
              <i className="fi fi-rr-suitcase-alt"></i>
            </div>
            <div className="spec-info">
              <span className="spec-label">Equipaje</span>
              <span className="spec-val">Hasta <strong>{luggageCount}</strong> valijas</span>
            </div>
          </div>
        </div>

        {/* Etiquetas de Atributos de Confort y Seguridad */}
        <div className="card-travel-features-list">
          <span className="feature-chip">
            <i className="fi fi-rr-snowflake"></i> Climatizado
          </span>
          <span className="feature-chip">
            <i className="fi fi-rr-badge-check"></i> Habilitación CNRT
          </span>
          <span className="feature-chip">
            <i className="fi fi-rr-steering-wheel"></i> Chofer Pro
          </span>
        </div>

        {/* Barra de Estado Inferior (Sin Botón de Consulta/Compra) */}
        <div className="card-travel-footer-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-label">Unidad Habilitada y en Servicio</span>
          </div>
          <span className="status-verified-pill" title="100% Asegurado y Certificado">
            <i className="fi fi-rr-check"></i> Activo
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardTravel;