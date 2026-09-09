import './poster_contact.css';
import { Link } from 'react-router';
import logoLetra from '../../assets/logo_letra.png';
import { useTranslation } from 'react-i18next';

function PosterContact() {
  const { t } = useTranslation();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="footer-brand-section">
      <div className="footer-logo">
        <Link to="/" onClick={handleScrollToTop} title="Blue Calafate">
          <img src={logoLetra} alt="Blue Calafate" />
        </Link>
      </div>

      <p className="footer-description">
        {t(
          'footer.desc',
          'Traslados privados y compartidos en El Calafate y El Chaltén. Experiencias únicas, seguras y confortables en la Patagonia.'
        )}
      </p>

      <a
        href="https://wa.me/5492966764900?text=Hola%20Blue%20Calafate,%20quiero%20hacer%20una%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        className="footer-whatsapp-btn"
        title={t('footer.whatsapp_small', 'RESERVAR POR WHATSAPP')}
      >
        <div className="footer-whatsapp-icon">
          <i className="fi fi-brands-whatsapp"></i>
        </div>
        <div className="footer-whatsapp-text">
          <small>{t('footer.whatsapp_small', 'RESERVAR POR WHATSAPP')}</small>
          <strong>+54 9 2966 764900</strong>
        </div>
      </a>
    </div>
  );
}

export { PosterContact };