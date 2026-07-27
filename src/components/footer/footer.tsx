import './footer.css'
function Footer() {

    return (

        <footer className="blue-footer">

            <img className="image-background-footer" src="/src/assets/portada.jpg" alt="" />

            <div className="footer-top">


                <div className='conteiner-blue-footer'>

                    <div className="footer-logo">
                        <img src="./src/assets/logo_letra.png" alt="Blue Calafate" />
                    </div>



                    <p className="footer-description">
                        Traslados privados y experiencias únicas en El Calafate y El Chaltén.
                        Viajá cómodo, viajá seguro.
                    </p>

                    <div className="footer-whatsapp">

                        <div className="footer-whatsapp-icon">
                            <img src="/src/assets/whatsapp.png" className="fa-brands fa-whatsapp" />
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
                        <li><a href='#' className="fa-solid fa-chevron-right"> Inicio</a></li>
                        <li><a href='#' className="fa-solid fa-chevron-right"> Servicios</a></li>
                        <li><a href='#' className="fa-solid fa-chevron-right"> Vehículos</a></li>
                        <li><a href='#' className="fa-solid fa-chevron-right"> Nosotros</a></li>
                        <li><a href='#' className="fa-solid fa-chevron-right"> Reviews</a></li>
                        <li><a href='#' className="fa-solid fa-chevron-right"> Contacto</a></li>
                    </ul>

                </div>

                <div className="footer-column">

                    <h3>
                        <i className="fa-regular fa-clock"></i>
                        SERVICIOS
                    </h3>

                    <ul>
                        <li><i className="fa-solid fa-chevron-right"> </i>Traslados Aeropuerto</li>
                        <li><i className="fa-solid fa-chevron-right"> </i>Glaciar Perito Moreno</li>
                        <li><i className="fa-solid fa-chevron-right"> </i>Traslado a El Chaltén</li>
                        <li><i className="fa-solid fa-chevron-right"> </i>City Tour El Calafate</li>
                        <li><i className="fa-solid fa-chevron-right"> </i>Trekking Privados</li>
                        <li><i className="fa-solid fa-chevron-right"> </i>Traslados Premium</li>
                    </ul>

                </div>


                <div className="footer-column">

                    <h3>
                        <i className="fa-solid fa-user-shield"></i>
                        NUESTROS DIFERENCIALES
                    </h3>

                    <ul>
                        <li><i className="fa-solid fa-circle-check">&#10004;</i> Servicio Privado</li>
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

                    <div className='container-info-footer'>

                        <div className="contact-item">
                            <i className="fa-solid fa-phone">
                                <img className="pm-icon-p" src="/src/assets/logo_tel.png" alt="" />
                            </i>
                            <div>+54 9 2966 764900</div>
                        </div>

                        <div className="contact-item">
                            <i className="fa-solid fa-envelope">
                                <img className="pm-icon-p" src="/src/assets/logo_email.png" alt="" />
                            </i>
                            <div>bluecalafatepatagonia@gmail.com</div>
                        </div>

                        <div className="contact-item">
                            <i className="fa-solid fa-location-dot">
                                <img className="pm-icon-p" src="/src/assets/logo_address.png" alt="" />
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
                        <h4>Tu reserva es 100% privada y segura.</h4>
                        <p>Te confirmaremos todo por WhatsApp.</p>
                    </div>

                </div>

                    // Redes sociales



                <div className="bottom-box">

                    <i className="fa-solid fa-shield-heart"></i>

                    <div>
                        <h4>SERVICIO 100% PRIVADO</h4>
                        <p>Sin esperas ni viajes compartidos.</p>
                    </div>

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
    )
}

export { Footer };