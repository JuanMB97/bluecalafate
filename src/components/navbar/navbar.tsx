import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language_switcher/LanguageSwitcher';
import './navbar.css';
import logoLetra from '../../assets/logo_letra.png';
function NavBar() {
  const { t } = useTranslation();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header className="box-navbar">
      <div className="box-logo">
        <Link to="/">
          <img src={logoLetra} alt="Blue Calafate" />
        </Link>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'desktop-icon nav-link active' : 'desktop-icon nav-link')}
          end
        >
          {t('nav.home', 'INICIO')}
        </NavLink>

        <NavLink
          to="/"
          className="mobile-icon"
          onClick={handleScrollToTop}
          end
        >
          <i className="mobile-icon fi fi-sr-house-chimney"></i>
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? 'desktop-icon nav-link active' : 'desktop-icon nav-link')}
        >
          {t('nav.services', 'SERVICIOS')}
        </NavLink>
        <NavLink
          to="/services"
          className="mobile-icon"
          onClick={handleScrollToTop}
        >
          <i className="mobile-icon fi fi-sr-land-layer-location"></i>
        </NavLink>

        <NavLink
          to="/ourteam"
          className={({ isActive }) => (isActive ? 'desktop-icon nav-link active' : 'desktop-icon nav-link')}
        >
          {t('nav.about', 'NOSOTROS')}
        </NavLink>
        <NavLink
          to="/ourteam"
          className="mobile-icon"
          onClick={handleScrollToTop}
        >
          <i className="mobile-icon fi fi-ss-employees"></i>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'desktop-icon nav-link active' : 'desktop-icon nav-link')}
        >
          {t('nav.contact', 'CONTACTO')}
        </NavLink>
        <NavLink
          to="/contact"
          className="mobile-icon"
          onClick={handleScrollToTop}
        >
          <i className="mobile-icon fi fi-sr-land-layer-location"></i>
        </NavLink>

      </nav>

      <div className="nav-actions">
        <LanguageSwitcher />

      </div>
    </header>
  );
}

export { NavBar };