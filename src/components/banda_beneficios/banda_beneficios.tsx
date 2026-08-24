import securityIco from '../../assets/security_ico.png';
import driverIco from '../../assets/driver_ico.png';
import buslatIco from '../../assets/buslat_ico.png';
import mountainIco from '../../assets/mountain_ico.png';

function Banda_Beneficios() {
  return (
    <div className="pm-benefits">
      <div className="pm-benefit">
        <img className="pm-icon-p" src={securityIco} alt="Seguridad" />
        <div>
          <strong>Salida Garantizada</strong>
          <p>Todos los días desde El Calafate.</p>
        </div>
      </div>

      <div className="pm-benefit">
        <img className="pm-icon-p" src={driverIco} alt="Chofer" />
        <div>
          <strong>Chofer Profesional</strong>
          <p>Conductores habilitados.</p>
        </div>
      </div>

      <div className="pm-benefit">
        <img className="pm-icon-p" src={buslatIco} alt="Comodidad" />
        <div>
          <strong>Comodidad</strong>
          <p>Unidades modernas y confortables.</p>
        </div>
      </div>

      <div className="pm-benefit">
        <img className="pm-icon-p" src={mountainIco} alt="Experiencia" />
        <div>
          <strong>Experiencia Única</strong>
          <p>Descubrí los paisajes más asombrosos del mundo.</p>
        </div>
      </div>
    </div>
  );
}

export { Banda_Beneficios };