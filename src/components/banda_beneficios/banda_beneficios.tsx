import './benefits_banner.css';
import { useTranslation } from 'react-i18next';

function Banda_Beneficios() {
  const { t } = useTranslation();

  return (
    <div className="pm-benefits">
      <div className="pm-benefit">
        <i className="fi fi-rs-shield-check pm-icon-p"></i>
        <div>
          <strong>{t('benefits.guaranteed_title', 'Salida Garantizada')}</strong>
          <p>{t('benefits.guaranteed_desc', 'Todos los días desde El Calafate.')}</p>
        </div>
      </div>

      <div className="pm-benefit">
        <i className="fi fi-br-seatbelt-safety-driver"></i>
        <div>
          <strong>{t('benefits.driver_title', 'Chofer Profesional')}</strong>
          <p>{t('benefits.driver_desc', 'Conductores habilitados.')}</p>
        </div>
      </div>

      <div className="pm-benefit">
        <i className="fi fi-rs-bus"></i>
        <div>
          <strong>{t('benefits.comfort_title', 'Comodidad')}</strong>
          <p>{t('benefits.comfort_desc', 'Unidades modernas y confortables.')}</p>
        </div>
      </div>

      <div className="pm-benefit">
        <i className="fi fi-sr-mountain"></i>
        <div>
          <strong>{t('benefits.unique_exp_title', 'Experiencia Única')}</strong>
          <p>{t('benefits.unique_exp_desc', 'Descubrí los paisajes más asombrosos del mundo.')}</p>
        </div>
      </div>
    </div>
  );
}

export { Banda_Beneficios };