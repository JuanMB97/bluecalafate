import { Link } from 'react-router';
import './footer.css';
import { SocialMedia } from '../redes_sociales/social_media';
import portadaImg from '../../assets/portada.jpg';
import logoLetra from '../../assets/logo_letra.png';
import whatsappIco from '../../assets/whatsapp.png';
import logoTel from '../../assets/logo_tel.png';
import logoEmail from '../../assets/logo_email.png';
import logoAddress from '../../assets/logo_address.png';

function Footer() {
  return (
    <footer className="blue-footer">
      <img className="image-background-footer" src={portadaImg} alt="" />

      <div className="footer-top">
        <div className="conteiner-blue-footer">
          <div className="footer-logo">
            <Link to="/">
              <img src={logoLetra} alt="Blue Calafate" />
            </Link>
          </div>

          <p className="footer-description">
            Traslados privados y experiencias únicas en El Calafate y El Chaltén.
            Viajá cómodo, viajá seguro.
          </p>

          <div className="footer-whatsapp">
            <div className="footer-whatsapp-icon">
              <img src={whatsappIco} alt="WhatsApp" />
            </div>

            <div className="footer-whatsapp-text">
              <small>RESERVAR POR WHATSAPP</small>
              <strong>+54 9 2966 764900</strong>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <h3>
            <i className="fa-solid fa-shield-check"></i>
            ENLACES
          </h3>

          <ul>
            <li><Link to="/" className="fa-solid fa-chevron-right"> Inicio</Link></li>
            <li><Link to="/services" className="fa-solid fa-chevron-right"> Servicios</Link></li>
            <li><Link to="/tours/perito-moreno" className="fa-solid fa-chevron-right"> Perito Moreno</Link></li>
            <li><Link to="/tours/el-chalten" className="fa-solid fa-chevron-right"> El Chaltén</Link></li>
            <li><Link to="/ourteam" className="fa-solid fa-chevron-right"> Nosotros</Link></li>
            <li><Link to="/contact" className="fa-solid fa-chevron-right"> Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>
            <i className="fa-regular fa-clock"></i>
            SERVICIOS
          </h3>

          <ul>
            <li><Link to="/tours/traslado-aeropuerto" className='fa-solid'><i> </i>Traslados Aeropuerto</Link></li>
            <li><Link to="/tours/perito-moreno" className="fa-solid"><i> </i>Glaciar Perito Moreno</Link></li>
            <li><Link to="/tours/el-chalten" className="fa-solid"><i> </i>Traslado a El Chaltén</Link></li>
            <li><Link to="/tours/city-tour" className="fa-solid"><i> </i>City Tour El Calafate</Link></li>
            <li><Link to="/services" className="fa-solid"><i> </i>Traslados Premium</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>
            <i className="fa-solid fa-user-shield"></i>
            NUESTROS DIFERENCIALES
          </h3>

          <ul>
            <li><i className="fa-solid fa-circle-check">&#10004;</i> Servicio Privado y Compartido</li>
            <li><i className="fa-solid fa-circle-check">&#10004;</i> Puntualidad Garantizada</li>
            <li><i className="fa-solid fa-circle-check">&#10004;</i> Choferes Profesionales</li>
            <li><i className="fa-solid fa-circle-check">&#10004;</i> Seguridad y Confianza</li>
            <li><i className="fa-solid fa-circle-check">&#10004;</i> Confort Asegurado</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>
            <i className="fa-solid fa-location-dot"></i>
            CONTACTO
          </h3>

          <div className="container-info-footer">
            <div className="contact-item">
              <i className="fa-solid fa-phone">
                <img className="pm-icon-p" src={logoTel} alt="Teléfono" />
              </i>
              <div>+54 9 2966 764900</div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-envelope">
                <img className="pm-icon-p" src={logoEmail} alt="Email" />
              </i>
              <div>bluecalafatepatagonia@gmail.com</div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-location-dot">
                <img className="pm-icon-p" src={logoAddress} alt="Ubicación" />
              </i>
              <div>El Calafate, Santa Cruz<br />Argentina</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-box">
          <i className="fa-solid fa-lock"></i>
          <div>
            <h4>Tu reserva es 100% segura.</h4>
            <p>Te confirmaremos todo por WhatsApp.</p>
          </div>
        </div>

        <div className="bottom-box">
          <SocialMedia />
        </div>

        <div className="bottom-box">
          <i className="fa-solid fa-mountain"></i>
          <div>
            <h4>DISEÑADO CON ❤️</h4>
            <p>EN LA PATAGONIA</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };