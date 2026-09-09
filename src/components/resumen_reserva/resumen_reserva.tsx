import React from 'react';
import type { ResumenReservaProps } from '../../types';

export const Resumen_reserva: React.FC<ResumenReservaProps> = ({
  tourTitle = 'Perito Moreno',
  serviceMode = 'shared',
  departureTime = '08:00 hs',
  returnTime = '14:00 hs',
  pricePerPerson = 'ARS 35.000',
  totalAmount = 'ARS 70.000',
  image = 'pasarelas.jpg',
  date = '',
  passengersCount = 2,
  passengerName = '',
  meetingPoint = '',
  paymentMethod = 'Efectivo / Cash',
  whatsappNumber = '5492966764900',
  onBackToForm,
}) => {
  const imageUrl =
    image && typeof image === 'string' && (image.startsWith('http') || image.startsWith('/'))
      ? image
      : image && typeof image === 'string'
        ? new URL(`../../assets/${image}`, import.meta.url).href
        : '';

  const isPrivate = serviceMode === 'private';
  const modalityLabel = isPrivate ? 'Privado VIP (Horario a Elección)' : 'Compartido (Horario Fijo)';
  const isMoreThanFour = passengersCount > 4;

  const passengersLabel = isMoreThanFour
    ? 'Más de 4 personas (Cotización grupal)'
    : `${passengersCount} ${passengersCount === 1 ? 'pasajero' : 'pasajeros'} (Base hasta 4 pax)`;

  const lines = [
    isMoreThanFour
      ? `¡Hola Blue Calafate! Quisiera consultar presupuesto para *${tourTitle}* (${modalityLabel}) para un grupo de más de 4 personas.`
      : `¡Hola Blue Calafate! Quisiera reservar el servicio de *${tourTitle}* (${modalityLabel}).`,
    date ? `📅 *Fecha:* ${date}` : '',
    `⏰ *Salida:* ${departureTime}`,
    `⏰ *Regreso:* ${returnTime}`,
    `👥 *Pasajeros:* ${passengersLabel}`,
    passengerName ? `👤 *Nombre:* ${passengerName}` : '',
    meetingPoint ? `📍 *Punto de encuentro:* ${meetingPoint}` : '',
    paymentMethod ? `💳 *Método de pago:* ${paymentMethod}` : '',
    totalAmount ? `💰 *Total:* ${totalAmount}` : '',
  ].filter(Boolean);

  const waText = encodeURIComponent(lines.join('\n'));
  const waLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

  return (
    <div className={`pm-summary-card ${isPrivate ? 'card-mode-private' : ''}`}>
      {onBackToForm && (
        <div className="pm-summary-top-nav">
          <button
            type="button"
            className="pm-summary-back-btn"
            onClick={onBackToForm}
          >
            <i className="fi fi-rr-arrow-left"></i>
            <span>Modificar Datos de la Reserva</span>
          </button>
        </div>
      )}

      <img className="pm-summary-image" src={imageUrl} alt={tourTitle} />

      <div className="pm-summary-header-box">
        <span className={`pm-summary-step-tag ${isPrivate ? 'tag-gold' : 'tag-blue'}`}>
          <i className="fi fi-sr-badge-check"></i> Paso 3: Confirmación
        </span>
        <h3>Resumen de tu reserva</h3>
        <p className="pm-summary-subtitle">
          Revisá los datos ingresados antes de confirmar por WhatsApp
        </p>
      </div>

      <div className="pm-summary-row">
        <span>Servicio</span>
        <strong>{tourTitle}</strong>
      </div>

      <div className="pm-summary-row">
        <span>Modalidad</span>
        <strong className={isPrivate ? 'text-gold' : 'text-blue'}>
          {isPrivate ? 'Privado VIP' : 'Compartido'}
        </strong>
      </div>

      <div className="pm-summary-row">
        <span>Salida</span>
        <strong>{departureTime}</strong>
      </div>

      <div className="pm-summary-row">
        <span>Regreso</span>
        <strong>{returnTime}</strong>
      </div>

      {date && (
        <div className="pm-summary-row">
          <span>Fecha</span>
          <strong>{date}</strong>
        </div>
      )}

      <div className="pm-summary-row">
        <span>Pasajeros</span>
        <strong>{passengersLabel}</strong>
      </div>

      {passengerName && (
        <div className="pm-summary-row">
          <span>Titular</span>
          <strong>{passengerName}</strong>
        </div>
      )}

      {meetingPoint && (
        <div className="pm-summary-row">
          <span>Punto de encuentro</span>
          <strong>{meetingPoint}</strong>
        </div>
      )}

      {paymentMethod && (
        <div className="pm-summary-row">
          <span>Método de pago</span>
          <strong>{paymentMethod}</strong>
        </div>
      )}

      <div className="pm-summary-row">
        <span>Precio unitario</span>
        <strong>{isMoreThanFour ? 'A cotizar' : pricePerPerson}</strong>
      </div>

      <div className={`pm-total ${isPrivate ? 'total-gold' : ''}`}>
        {isMoreThanFour ? 'A consultar' : totalAmount}
      </div>

      <a
        className="pm-reserve-btn"
        target="_blank"
        rel="noopener noreferrer"
        href={waLink}
      >
        <i className="fi fi-brands-whatsapp" style={{ marginRight: '8px', fontSize: '20px' }}></i>
        {isMoreThanFour ? 'CONSULTAR POR WHATSAPP' : 'CONFIRMAR POR WHATSAPP'}
      </a>
    </div>
  );
};

export default Resumen_reserva;