import './buttom_whatsapp.css';
import { useTranslation } from 'react-i18next';

function WspButtom() {
  const { t } = useTranslation();


  return (
    <div className="nav-whatsapp">
      <a
        className="box-whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
        href="https://wa.me/5492966764900"
        title={t('nav.whatsapp_title', 'Contactar por WhatsApp')}
      >
        <i className="fi fi-brands-whatsapp"></i>
      </a>
    </div>
  )
}

export { WspButtom };