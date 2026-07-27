import './banner.css';

function BannerInfo() {

  return (
    <div className="pm-timebar">

      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src="./src/assets/date_ico.png" alt="" />
        </div>
        <div>
          <strong>Salidas diarias</strong>
          <p>con horario fijo</p>
        </div>
      </div>

      <div className="pm-divider"></div>

      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src="./src/assets/bus_ico.png" alt="" />
        </div>
        <div>
          <p>Salida</p>
          <strong>08:00 hs</strong>
        </div>
      </div>

      <div className="pm-divider"></div>

      <div className="pm-time-item">
        <div className="pm-icon">
          <img className="pm-icon-p" src="./src/assets/buslat_ico.png" alt="" />
        </div>
        <div>
          <p>Regreso</p>
          <strong>14:00 hs</strong>
        </div>
      </div>

    </div>

  )
};

export { BannerInfo };