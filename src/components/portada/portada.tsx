import './portada.css';
import { BannerInfo } from "../banner_info/banner";
import { NavBar } from "../navbar/navbar";

function Portada({place, phrase, image}: {place: string, phrase: string, image: string}) {

  const link_img = '/src/assets/' + image;

  return (

    <section className="pm-shared-section">
      <img className="portada-img" src={link_img} alt="" />
      <NavBar></NavBar>
      
      <div className="pm-hero">
        <div className="pm-overlay"></div>
          
        <div className="pm-hero-content">
          <div className="pm-left">
            <h1>
              {place} <span>Compartido</span>
            </h1>

            <p>
              {phrase}
            </p>

            <div className="pm-features">
              <div className="pm-feature">
                <img className="pm-icon-p" src="./src/assets/users_ico.png" alt="" />
                <div>
                  <strong>Servicio Compartido</strong>
                </div>
              </div>

              <div className="pm-feature">
                <img className="pm-icon-p" src="./src/assets/clock_ico.png" alt="" />
                <div>
                  <strong>Salidas diarias</strong>
                </div>
              </div>

              <div className="pm-feature">
                <img className="pm-icon-p" src="./src/assets/security_ico.png" alt="" />
                <div>
                  <strong>Seguro y confiable</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <BannerInfo />

    </section>
  )
}

export { Portada };