import './portada.css';
import usersIco from '../../assets/users_ico.png';
import clockIco from '../../assets/clock_ico.png';
import securityIco from '../../assets/security_ico.png';

interface PortadaProps {
  place?: string;
  phrase?: string;
  image?: string;
  highlightText?: string;
  serviceType?: string;
  dailyDepartures?: string;
}

function Portada({
  place = 'Traslados en el sur de Argentina',
  phrase = 'Traslado compartido y privado en El Calafate y El Chaltén. Cómodo, seguro y económico.',
  image = 'portada_car.jpeg',
  highlightText = 'Compartido',
  serviceType = 'Servicio Compartido',
  dailyDepartures = 'Salidas diarias',
}: PortadaProps) {
  // Vite dynamic asset resolution
  const imageUrl = image.startsWith('http') || image.startsWith('/')
    ? image
    : new URL(`../../assets/${image}`, import.meta.url).href;

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
          </div>
        </div>
      </div>
    </section>
  );
}

export { Portada };