import CardTravel from "../components/card-travel/card_travel";
import { Footer } from "../components/footer/footer";
import FormularioReserva from "../components/formulario/form_reserva";
import { Portada } from "../components/portada/portada";
import { Resumen_reserva } from "../components/resumen_reserva/resumen_reserva";

function AppMain() {
  return (
    <>
      <Portada 
        place="Traslados en el sur de Argentina"
        phrase="Traslado compartido al Glaciar Perito Moreno desde El Calafate. Cómodo, seguro y económico." 
        image="portada_car.jpeg"
      />

      <div className="conteiner-cards">
        <CardTravel />
        <CardTravel />
        <CardTravel />
      </div>

      <div className="pm-grid">
        <FormularioReserva></FormularioReserva>

        <Resumen_reserva></Resumen_reserva>

      </div>
      


      <Footer>

      </Footer>
    </>

  )
}

export default AppMain;