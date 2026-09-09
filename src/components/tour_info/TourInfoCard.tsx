import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TourInfoCardProps } from '../../types';
import './TourInfoCard.css';
import TicketParque from '../ticket_parque/ticket_parque';

export const TourInfoCard: React.FC<TourInfoCardProps> = ({
  tour,
  serviceMode = 'shared',
  onServiceModeChange,
  onProceedToForm,
}) => {
  const { t } = useTranslation();
  const isPrivate = serviceMode === 'private';
  const hasOptions = tour.hasPrivateOption !== false;

  const defaultPrivatePrice = Math.round((tour.priceNumber || 35000) * 1.85);
  const currentPrice = isPrivate
    ? (tour.privatePricePerPerson || `ARS $${defaultPrivatePrice.toLocaleString('es-AR')}`)
    : tour.pricePerPerson;

  const currentPhrase = isPrivate
    ? (tour.privatePhrase || `Traslado privado y exclusivo a ${tour.place || tour.title}. Viajá a tu propio ritmo con vehículo y chofer a disposición, eligiendo tu horario de salida y regreso.`)
    : tour.phrase;

  const currentServiceTag = isPrivate
    ? 'Servicio Privado Exclusivo VIP'
    : (tour.serviceType || 'Servicio Compartido');

  const hasMultipleSharedShifts =
    Boolean(tour.sharedDepartureTimes && tour.sharedDepartureTimes.length > 1) ||
    tour.departureTime.includes('/');

  return (
    <div className={`pm-form-card tour-info-card ${isPrivate ? 'card-mode-private' : ''}`}>
      {/* Selector de modalidad si el tour tiene opción privada */}
      {hasOptions && onServiceModeChange && (
        <div className="tour-card-modality-selector">
          <button
            type="button"
            className={`tour-card-mod-btn ${!isPrivate ? 'active shared' : ''}`}
            onClick={() => onServiceModeChange('shared')}
          >
            <i className="fi fi-sr-users-alt"></i>
            <div>
              <strong>Servicio Compartido</strong>
              <small>Económico • Horario fijo • Hasta 4 pax</small>
            </div>
          </button>

          <button
            type="button"
            className={`tour-card-mod-btn ${isPrivate ? 'active private' : ''}`}
            onClick={() => onServiceModeChange('private')}
          >
            <i className="fi fi-sr-crown"></i>
            <div>
              <strong>Servicio Privado VIP</strong>
              <small>Exclusivo • Horario a elección • Hasta 4 pax</small>
            </div>
          </button>
        </div>
      )}

      {/* Encabezado */}
      <div className="pm-card-title tour-info-header">
        <div className={`pm-number tour-info-badge-icon ${isPrivate ? 'badge-gold' : ''}`}>
          <i className={isPrivate ? 'fi fi-sr-car-alt' : 'fi fi-sr-route'}></i>
        </div>

        <div className="tour-info-title-box">
          <div className="tour-info-badge-row">
            <span className={`tour-info-service-tag ${isPrivate ? 'tag-gold' : ''}`}>
              <i className="fi fi-sr-badge-check"></i> {currentServiceTag}
            </span>
          </div>
          <h2>
            {tour.title} {isPrivate ? '(Privado VIP - Hasta 4 personas)' : '(Compartido - Hasta 4 personas)'}
          </h2>
          <p className="tour-info-subtitle">
            {isPrivate
              ? 'Vehículo exclusivo y chofer privado a tu entera disposición con horario a medida'
              : t('tour_info.subtitle', 'Detalles del servicio, itinerario y lo que incluye')}
          </p>
        </div>
      </div>

      {/* Frase descriptiva destacada */}
      <div className={`tour-info-phrase-box ${isPrivate ? 'phrase-gold' : ''}`}>
        <i className="fi fi-rr-quote-right tour-quote-icon"></i>
        <p>{currentPhrase}</p>
      </div>

      {/* Tarjeta explicativa sobre capacidad y diferencia de horarios */}
      <div className={`tour-capacity-notice-card ${isPrivate ? 'notice-gold' : 'notice-blue'}`}>
        <div className="tour-capacity-notice-icon">
          <i className="fi fi-sr-users-alt"></i>
        </div>
        <div className="tour-capacity-notice-text">
          <strong>Capacidad estándar: Hasta 4 personas</strong>
          <p>
            Tanto el servicio <strong>Compartido</strong> como el <strong>Privado VIP</strong> están configurados para hasta 4 personas. La diferencia principal es la <strong>elección del horario</strong>: en privado vos decidís tu horario de salida y regreso.
          </p>
          <div className="tour-capacity-consult-pill">
            <i className="fi fi-rr-info"></i>
            <span>¿Son más de 4 personas? <strong>Consultanos precio para cotizar vehículos adicionales.</strong></span>
          </div>
        </div>
      </div>

      {/* Grilla de información rápida / especificaciones */}
      <div className="tour-specs-grid">
        <div className="tour-spec-item">
          <div className={`tour-spec-icon ${isPrivate ? 'icon-gold-solid' : ''}`}>
            <i className="fi fi-rr-clock"></i>
          </div>
          <div className="tour-spec-content">
            <small>{t('tour_info.departure', 'Salida')}</small>
            {!isPrivate ? (
              hasMultipleSharedShifts ? (
                <div className="tour-spec-chips">
                  <span className="spec-chip chip-blue">08:00 hs</span>
                  <span className="spec-chip chip-purple">14:00 hs</span>
                </div>
              ) : (
                <strong>{tour.departureTime} (Fijo)</strong>
              )
            ) : (
              <strong className="text-gold">A tu elección</strong>
            )}
          </div>
        </div>

        <div className="tour-spec-item">
          <div className={`tour-spec-icon ${isPrivate ? 'icon-gold-solid' : ''}`}>
            <i className="fi fi-rr-clock-three"></i>
          </div>
          <div className="tour-spec-content">
            <small>{t('tour_info.return', 'Regreso')}</small>
            {!isPrivate ? (
              hasMultipleSharedShifts ? (
                <div className="tour-spec-chips">
                  <span className="spec-chip chip-return-light">14:00 hs</span>
                  <span className="spec-chip chip-return-light">19:30 hs</span>
                </div>
              ) : (
                <strong>{tour.returnTime} (Fijo)</strong>
              )
            ) : (
              <strong className="text-gold">A tu propio ritmo</strong>
            )}
          </div>
        </div>

        <div className="tour-spec-item">
          <div className={`tour-spec-icon ${isPrivate ? 'icon-gold-solid' : ''}`}>
            <i className="fi fi-sr-users"></i>
          </div>
          <div className="tour-spec-content">
            <small>Capacidad Base</small>
            <strong>Hasta 4 personas</strong>
          </div>
        </div>

        <div className={`tour-spec-item highlight-price ${isPrivate ? 'highlight-price-gold' : ''}`}>
          <div className={`tour-spec-icon ${isPrivate ? 'icon-gold-solid' : ''}`}>
            <i className="fi fi-tr-usd-circle"></i>
          </div>
          <div className="tour-spec-content">
            <small>{isPrivate ? 'Tarifa Servicio Privado' : t('tour_info.price_per_person', 'Tarifa por Persona')}</small>
            <strong>{currentPrice}</strong>
          </div>
        </div>
      </div>

      {/* Qué incluye el servicio */}
      <div className="tour-features-section">
        <h3 className="tour-section-title">
          <i className={isPrivate ? 'fi fi-sr-star' : 'fi fi-sr-shield-check'}></i>
          {isPrivate ? '¿Qué incluye el Servicio Privado?' : t('tour_info.included_title', '¿Qué incluye este servicio?')}
        </h3>

        <ul className="tour-included-list">
          {isPrivate ? (
            <>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <strong>Vehículo exclusivo para vos y tus acompañantes (sin pasajeros externos)</strong>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <strong>Chofer profesional a tu completa disposición durante todo el recorrido</strong>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <strong>Flexibilidad total de horarios: elegís a qué hora salir y cuándo regresar</strong>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <strong>Paradas panorámicas y tiempo en pasarelas 100% adaptado a tu ritmo</strong>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <strong>Información de historia, flora y fauna patagónica</strong>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <span>Habilitación parque nacional para turismo</span>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico text-emerald"></i>
                <span>Coordinación VIP directa 24/7 vía WhatsApp</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico"></i>
                <span>{t('tour_info.inc_transfer', 'Traslado ida y vuelta en unidades modernas y habilitadas')}</span>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico"></i>
                <span>{t('tour_info.inc_driver', 'Chofer profesional habilitado y con experiencia en rutas patagónicas')}</span>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico"></i>
                <span>{t('tour_info.inc_insurance', 'Seguro de transporte de pasajeros incluido')}</span>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico"></i>
                <span>{t('tour_info.inc_stops', 'Paradas panorámicas para fotografías según itinerario')}</span>
              </li>
              <li>
                <i className="fi fi-sr-check-circle tour-check-ico"></i>
                <span>{t('tour_info.inc_support', 'Coordinación y asistencia directa 24/7 vía WhatsApp')}</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* No incluye y recomendaciones */}
      <div className="tour-extra-info-grid">
        <div className="tour-not-included-card">
          <h4>
            <i className="fi fi-rr-cross-circle"></i>
            {t('tour_info.not_included_title', 'No incluye')}
          </h4>
          <ul>
            <li>{t('tour_info.not_inc_park', 'Entrada al Parque Nacional (se abona en el acceso o web oficial)')}</li>
            <li>{t('tour_info.not_inc_food', 'Almuerzo, comidas o bebidas no especificadas')}</li>
            <li>{t('tour_info.not_inc_tour_guide', 'Guia de turismo')}</li>
          </ul>
        </div>

        <div className="tour-recommendations-card">
          <h4>
            <i className="fi fi-rr-sun"></i>
            {t('tour_info.recommendations_title', 'Recomendaciones')}
          </h4>
          <p>{t('tour_info.rec_clothing', 'Llevar ropa de abrigo en capas, calzado cómodo, lentes de sol y protector solar.')}</p>
        </div>
      </div>

      <TicketParque />

      {/* Botón de llamado a la acción para pasar al formulario */}
      <div className="tour-info-footer-action">
        <button
          type="button"
          className={`tour-info-cta-btn ${isPrivate ? 'btn-cta-gold' : ''}`}
          onClick={onProceedToForm}
        >
          <span className="tour-cta-icon-left">
            <i className="fi fi-rr-edit"></i>
          </span>
          <span className="tour-cta-text">
            {isPrivate
              ? 'Reservar Servicio Privado'
              : t('tour_info.btn_add_data', 'Completar Datos para Reservar')}
          </span>
          <span className="tour-cta-icon-right">
            <i className="fi fi-rr-arrow-right"></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default TourInfoCard;
