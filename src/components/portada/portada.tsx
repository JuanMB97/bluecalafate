import type { PortadaProps } from '../../types';
import './portada.css';

function Portada({
  place = 'Traslados en el sur de Argentina',
  phrase = 'Traslado compartido y privado en El Calafate y El Chaltén. Cómodo, seguro y económico.',
  image = 'portada_car.jpeg',
  highlightText = 'Compartido',
}: PortadaProps) {
  // Vite dynamic asset resolution
  const imageUrl =
    image && typeof image === 'string' && (image.startsWith('http') || image.startsWith('/'))
      ? image
      : image && typeof image === 'string'
        ? new URL(`../../assets/${image}`, import.meta.url).href
        : '';

  return (
    <section className="pm-shared-section">
      <img className="portada-img" src={imageUrl} alt={place} />

      <div className="pm-hero">
        <div className="pm-overlay"></div>

        <div className="pm-hero-content">
          <div className="pm-left">
            <h1>
              {place} <span>{highlightText}</span>
            </h1>

            <p>{phrase}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Portada };


/*

 <div className="pm-features">
              <div className="pm-feature">
                <img className="pm-icon-p" src={usersIco} alt="Servicio" />
                <div>
                  <strong>{serviceType}</strong>
                </div>
              </div>

              <div className="pm-feature">
                <img className="pm-icon-p" src={clockIco} alt="Horarios" />
                <div>
                  <strong>{dailyDepartures}</strong>
                </div>
              </div>

              <div className="pm-feature">
                <img className="pm-icon-p" src={securityIco} alt="Seguridad" />
                <div>
                  <strong>Seguro y confiable</strong>
                </div>
              </div>
            </div>

            */