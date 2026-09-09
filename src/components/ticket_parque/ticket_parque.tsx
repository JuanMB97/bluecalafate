import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TicketParqueProps } from '../../types';
import logoPnlg from '../../assets/logo_pnlg.PNG';
import pasarelasBg from '../../assets/pasarelas.jpg';
import './ticket_parque.css';

export const TicketParque: React.FC<TicketParqueProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <section
      className={`ticket-park-banner-section ${className}`}
      aria-label={t('park_ticket.title', 'Entrada Obligatoria al Parque Nacional')}
    >
      <div className="ticket-park-banner-card">
        {/* Imagen de fondo */}
        <img
          src={pasarelasBg}
          alt="Parque Nacional Los Glaciares"
          className="ticket-park-bg-img"
          loading="lazy"
        />
        <div className="ticket-park-bg-overlay" />

        <div className="ticket-park-content">
          {/* Logo Oficial */}
          <div className="ticket-park-logo-col">
            <div className="ticket-park-logo-wrap">
              <img
                src={logoPnlg}
                alt="Logo Parque Nacional Los Glaciares"
                className="ticket-park-logo"
              />
            </div>
          </div>

          {/* Mensaje de Advertencia */}
          <div className="ticket-park-info-col">
            <div className="ticket-park-badge">
              <i className="fi fi-sr-triangle-warning"></i>
              <span>{t('park_ticket.warning_badge', 'AVISO IMPORTANTE • PARQUE NACIONAL')}</span>
            </div>

            <h2 className="ticket-park-title">
              {t('park_ticket.title', 'Entrada Obligatoria al Parque Nacional')}
            </h2>

            <p className="ticket-park-desc">
              {t(
                'park_ticket.message',
                'Para ingresar al Glaciar Perito Moreno y otros destinos es obligatorio contar con el ticket de acceso. Compralo con anticipación en el sitio oficial.'
              )}
            </p>
          </div>

          {/* Link / Botón Oficial de Compra */}
          <div className="ticket-park-action-col">
            <a
              href="https://ventaweb.apn.gob.ar/reserva/FTE"
              target="_blank"
              rel="noopener noreferrer"
              className="ticket-park-cta-btn"
              title={t('park_ticket.btn_buy', 'Comprar Entrada Oficial')}
              aria-label={t('park_ticket.btn_buy', 'Comprar Entrada Oficial')}
            >
              <i className="fi fi-sr-ticket"></i>
              <span>{t('park_ticket.btn_buy', 'Comprar Entrada Oficial')}</span>
              <i className="fi fi-rr-arrow-up-right ticket-park-cta-arrow"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketParque;