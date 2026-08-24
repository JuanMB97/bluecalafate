import { Link, NavLink } from 'react-router';
import './navbar.css';
import logoLetra from '../../assets/logo_letra.png';
import logoWhatsapp from '../../assets/logo_whatsapp.png';

function NavBar() {
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
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          end
        >
          INICIO
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          SERVICIOS
        </NavLink>
        <NavLink
          to="/ourteam"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          NOSOTROS
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          CONTACTO
        </NavLink>
      </nav>

      <div className="nav-whatsapp">
        <a
          className="box-whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/5492966764900"
          title="Contactar por WhatsApp"
        >
          <img src={logoWhatsapp} alt="WhatsApp" />
        </a>
      </div>
    </header>
  );
}

export { NavBar };