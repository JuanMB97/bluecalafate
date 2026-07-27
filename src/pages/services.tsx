import { Footer } from "../components/footer/footer";
import FormularioReserva from "../components/formulario/form_reserva";
import { Portada } from "../components/portada/portada";
import { Resumen_reserva } from "../components/resumen_reserva/resumen_reserva";

function ServiceApp(){
  return (
    <>
        <Portada></Portada>

        <div className="pm-grid">
          <FormularioReserva></FormularioReserva>

          <Resumen_reserva></Resumen_reserva>

        </div>



      <Footer>

      </Footer>
    </>
   
  )
}

export default ServiceApp;