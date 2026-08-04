import { BannerInfo } from "../components/banner_info/banner";
import { Footer } from "../components/footer/footer";
import FormularioReserva from "../components/formulario/form_reserva";
import { Portada } from "../components/portada/portada";
import { Resumen_reserva } from "../components/resumen_reserva/resumen_reserva";

function ElChalten() {
  return (
    <>
      <Portada 
        place="El Chalten"
        phrase="Traslado compartido a El Chalten desde El Calafate. Cómodo, seguro y económico."
        image="fitz-roy.jpg"
      />
      <BannerInfo/>

      <div className="pm-grid">
        <FormularioReserva></FormularioReserva>

        <Resumen_reserva></Resumen_reserva>

      </div>
      z


      <Footer>

      </Footer>
    </>

  )
}

export default ElChalten;