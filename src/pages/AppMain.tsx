import CardTravel from "../components/card-travel/card_travel";
import { Footer } from "../components/footer/footer";
import { Portada } from "../components/portada/portada";
import TourCard from "../components/tour_card/tour_card";


function AppMain() {
  return (
    <>
      <Portada
        place="Traslados en el sur de Argentina"
        phrase="Traslado compartido al Glaciar Perito Moreno desde El Calafate. Cómodo, seguro y económico."
        image="portada_car.jpeg"
      />

      <div className="conteiner-cards">
        <CardTravel
          img="spin_car.png"
          capacidad={4}
        />
        <CardTravel
          img="expert_car.webp"
          capacidad={6}
        />
        <CardTravel
          img="h1_car.png"
          capacidad={11}
        />
      </div>

      <div className="contain-cards-tours">
        <TourCard linkTour="/peritomoreno" tourimg="aeropuerto.jpeg" logo="icon_plane.png"/>
        <TourCard linkTour="/citytour" tourimg="city.jfif" logo="icon_camera.png"/>
        <TourCard linkTour="/elchalten" tourimg="chalten-city.jpg" logo="icon_"/>
      
      </div>

      <Footer>

      </Footer>
    </>

  )
}

export default AppMain;