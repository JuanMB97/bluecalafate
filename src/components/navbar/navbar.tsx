import './navbar.css';

function NavBar(){
  return (
    
          <div className="box-navbar">
            <div className="box-logo">
              <img src="./src/assets/logo_letra.png" alt="Blue Calafate" />
            </div>

            <nav className='nav-links'>
              <a className='nav-link' href="/">INICIO</a>
              <a className='nav-link' href="/services">SERVICIOS</a>
              <a className='nav-link' href="/ourteam">NOSOTROS</a>
              <a className='nav-link' href="/contact">CONTACTO</a>
            </nav>

            <div className='nav-whatsapp'>
              <a className="box-whatsapp-btn" target='_blank' href="https://wa.me/5492966764900">
                <img src="./src/assets/logo_whatsapp.png" alt="" />
              </a>
            </div>
          
          </div>
  )
}

export { NavBar };