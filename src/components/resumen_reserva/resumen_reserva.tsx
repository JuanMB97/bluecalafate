interface ResumenReservaProps {
  tourTitle?: string;
  departureTime?: string;
  returnTime?: string;
  pricePerPerson?: string;
  totalAmount?: string;
  image?: string;
}

function Resumen_reserva({
  tourTitle = 'Perito Moreno Compartido',
  departureTime = '08:00 hs',
  returnTime = '14:00 hs',
  pricePerPerson = 'ARS 35.000',
  totalAmount = 'ARS 70.000',
  image = 'pasarelas.jpg',
}: ResumenReservaProps) {
  const imageUrl = image.startsWith('http') || image.startsWith('/')
    ? image
    : new URL(`../../assets/${image}`, import.meta.url).href;

  const waText = encodeURIComponent(
    `¡Hola Blue Calafate! Quisiera reservar el servicio de ${tourTitle} (Salida: ${departureTime}, Regreso: ${returnTime}).`
  );
  const waLink = `https://wa.me/5492966764900?text=${waText}`;

  return (
    <div className="pm-summary-card">
      <img className="pm-summary-image" src={imageUrl} alt={tourTitle} />

      <h3>Resumen de tu reserva</h3>

      <div className="pm-summary-row">
        <span>Servicio</span>
        <strong>{tourTitle}</strong>
      </div>

      <div className="pm-summary-row">
        <span>Salida</span>
        <strong>{departureTime}</strong>
      </div>

      <div className="pm-summary-row">
        <span>Regreso</span>
        <strong>{returnTime}</strong>
      </div>

      <div className="pm-summary-row">
        <span>Precio por persona</span>
        <strong>{pricePerPerson}</strong>
      </div>

      <div className="pm-total">{totalAmount}</div>

      <a
        className="pm-reserve-btn"
        target="_blank"
        rel="noopener noreferrer"
        href={waLink}
      >
        RESERVAR POR WHATSAPP
      </a>

      <small>Tu reserva es 100% segura.</small>
    </div>
  );
}

export { Resumen_reserva };