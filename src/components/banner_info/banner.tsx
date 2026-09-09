import React from 'react';
import type { BannerInfoProps } from '../../types';
import './banner.css';

export const BannerInfo: React.FC<BannerInfoProps> = ({
  departureTime = '08:00 hs / 14:00 hs',
  returnTime = '14:00 hs / 19:30 hs',
  scheduleLabel,
  scheduleSublabel,
  serviceMode,
  hasModalitySwitch = false,
  onServiceModeChange,
}) => {
  const isPrivate = serviceMode === 'private';
  const defaultLabel = isPrivate ? 'Servicio Privado' : 'Salidas diarias';
  const defaultSublabel = isPrivate ? 'Horarios a tu medida' : 'con horario fijo';

  const isMultipleDeparture =
    departureTime.includes('/') || departureTime.includes('08:00 hs y 14:00 hs');

  return (
    <div className="pm-timebar-wrapper">
      {hasModalitySwitch && onServiceModeChange && (
        <div className="pm-modality-toggle-bar">
          <button
            type="button"
            className={`pm-modality-tab ${!isPrivate ? 'active shared' : ''}`}
            onClick={() => onServiceModeChange('shared')}
          >
            <i className="fi fi-sr-users-alt"></i>
            <div className="pm-tab-text">
              <span className="pm-tab-title">Servicio Compartido</span>
              <span className="pm-tab-subtitle">Económico • Horario fijo • Hasta 4 pax</span>
            </div>
            {!isPrivate && <span className="pm-tab-pill">Activo</span>}
          </button>

          <button
            type="button"
            className={`pm-modality-tab ${isPrivate ? 'active private' : ''}`}
            onClick={() => onServiceModeChange('private')}
          >
            <i className="fi fi-sr-crown"></i>
            <div className="pm-tab-text">
              <span className="pm-tab-title">Servicio Privado VIP</span>
              <span className="pm-tab-subtitle">Exclusivo • Horario a tu elección • Hasta 4 pax</span>
            </div>
            {isPrivate && <span className="pm-tab-pill vip">VIP</span>}
          </button>
        </div>
      )}

      <div className={`pm-timebar ${isPrivate ? 'pm-timebar-private' : ''}`}>
        <div className="pm-time-item">
          <div className={`pm-icon ${isPrivate ? 'pm-icon-gold' : ''}`}>
            <i className="fi fi-bs-calendar-lines-pen"></i>
          </div>
          <div>
            <strong>{scheduleLabel || defaultLabel}</strong>
            <p>{scheduleSublabel || defaultSublabel}</p>
          </div>
        </div>

        <div className="pm-divider"></div>

        <div className="pm-time-item">
          <div className={`pm-icon ${isPrivate ? 'pm-icon-gold' : ''}`}>
            <i className="fi fi-bs-cars"></i>
          </div>
          <div className="pm-time-details">
            <p>Salida</p>
            {serviceMode === 'shared' && isMultipleDeparture ? (
              <div className="pm-fixed-schedules-badges">
                <span className="pm-schedule-chip chip-morning" title="Turno Mañana">
                  <i className="fi fi-rr-sun"></i> 08:00 hs
                </span>
                <span className="pm-schedule-chip chip-afternoon" title="Turno Tarde">
                  <i className="fi fi-rr-sunset"></i> 14:00 hs
                </span>
              </div>
            ) : isPrivate ? (
              <div className="pm-private-badge-highlight">
                <span className="pm-schedule-chip chip-private">
                  <i className="fi fi-rr-clock"></i> {departureTime || 'A tu elección'}
                </span>
              </div>
            ) : (
              <strong>{departureTime}</strong>
            )}
          </div>
        </div>

        <div className="pm-divider"></div>

        <div className="pm-time-item">
          <div className={`pm-icon ${isPrivate ? 'pm-icon-gold' : ''}`}>
            <i className="fi fi-ts-car-bus"></i>
          </div>
          <div className="pm-time-details">
            <p>Regreso</p>
            {serviceMode === 'shared' && isMultipleDeparture ? (
              <div className="pm-fixed-schedules-badges">
                <span className="pm-schedule-chip chip-return-morning" title="Regreso Turno Mañana">
                  14:00 hs
                </span>
                <span className="pm-schedule-chip chip-return-afternoon" title="Regreso Turno Tarde">
                  19:30 hs
                </span>
              </div>
            ) : isPrivate ? (
              <div className="pm-private-badge-highlight">
                <span className="pm-schedule-chip chip-private-return">
                  <i className="fi fi-rr-refresh"></i> {returnTime || 'A tu conveniencia'}
                </span>
              </div>
            ) : (
              <strong>{returnTime}</strong>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerInfo;