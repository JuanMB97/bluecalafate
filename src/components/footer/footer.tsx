import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import './footer.css';
import { SocialMedia } from '../redes_sociales/social_media';
import portadaImg from '../../assets/portada.jpg';
import { PosterContact } from '../poster_contact/poster_contact';

function Footer() {
  const { t } = useTranslation();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="blue-footer">
      <div className="footer-bg-wrapper">
        <img className="image-background-footer" src={portadaImg} alt="" />
        <div className="footer-overlay" />
      </div>

      <div className="footer-container">
        <div className="footer-top">
          {/* Columna 1: Marca y WhatsApp */}
          <div className="footer-col-brand">
            <PosterContact />
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="footer-col">
            <h3 className="footer-col-title">
              <i className="fi fi-rr-link-alt"></i>
              {t('footer.links_title', 'ENLACES')}
            </h3>

            <ul className="footer-nav-list">
              <li>
                <Link to="/" onClick={handleScrollToTop}>
                  <i className="fi fi-rr-angle-small-right"></i>
                  {t('nav.home', 'Inicio')}
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={handleScrollToTop}>
                  <i className="fi fi-rr-angle-small-right"></i>
                  {t('nav.services', 'Servicios')}
                </Link>
              </li>
              <li>
                <Link to="/ourteam" onClick={handleScrollToTop}>
                  <i className="fi fi-rr-angle-small-right"></i>
                  {t('nav.about', 'Nosotros')}
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleScrollToTop}>
                  <i className="fi fi-rr-angle-small-right"></i>
                  {t('nav.contact', 'Contacto')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto y Redes */}
          <div className="footer-col">
            <h3 className="footer-col-title">
              <i className="fi fi-rr-marker"></i>
              {t('footer.contact_title', 'CONTACTO')}
            </h3>

            <div className="footer-contact-list">
              <a
                href="https://wa.me/5492966764900"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
                title="WhatsApp"
              >
                <i className="fi fi-sr-phone-flip"></i>
                <span>+54 9 2966 764900</span>
              </a>

              <a
                href="mailto:bluecalafatepatagonia@gmail.com"
                className="footer-contact-link"
                title="Email"
              >
                <i className="fi fi-sr-envelope"></i>
                <span>bluecalafatepatagonia@gmail.com</span>
              </a>

              <div className="footer-contact-link non-clickable">
                <i className="fi fi-ss-marker"></i>
                <span>El Calafate, Santa Cruz, Patagonia Argentina</span>
              </div>
            </div>

            <div className="footer-social-wrapper">
              <SocialMedia showTitle={true} />
            </div>
          </div>
        </div>

        {/* Sub-footer / Barra inferior */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Blue Calafate Patagonia. {t('footer.all_rights_reserved', 'Todos los derechos reservados.')}</p>
          </div>

          <div className="footer-developer">
            <span className="developer-label">{t('footer.designed_by', 'DISEÑADO POR')}</span>
            <a
              href="https://github.com/JuanMB97"
              target="_blank"
              rel="noopener noreferrer"
              className="develop-link"
              title="GitHub Juan Barreto"
            >
              <i className="fi fi-brands-github"></i>
              <span>Juan Barreto</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };