import './banner.css';
import dateIco from '../../assets/date_ico.png';
import busIco from '../../assets/bus_ico.png';
import buslatIco from '../../assets/buslat_ico.png';

interface BannerInfoProps {
  departureTime?: string;
  returnTime?: string;
  scheduleLabel?: string;
}

function BannerInfo({
  departureTime = '08:00 hs',
  returnTime = '14:00 hs',
  scheduleLabel = 'Salidas diarias',
}: BannerInfoProps) {
  return (
    <div className="pm-timebar">
      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src={dateIco} alt="Fecha" />
        </div>
        <div>
          <strong>{scheduleLabel}</strong>
          <p>con horario fijo</p>
        </div>
      </div>

      <div className="pm-divider"></div>

      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src={busIco} alt="Salida" />
        </div>
        <div>
          <p>Salida</p>
          <strong>{departureTime}</strong>
        </div>
      </div>

      <div className="pm-divider"></div>

      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src={buslatIco} alt="Regreso" />
        </div>
        <div>
          <p>Regreso</p>
          <strong>{returnTime}</strong>
        </div>
      </div>
    </div>
  );
}

export { BannerInfo };