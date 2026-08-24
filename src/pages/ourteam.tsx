import { Portada } from '../components/portada/portada';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import CardTravel from '../components/card-travel/card_travel';

export function OurTeamPage() {
  return (
    <>
      <Portada
        place="Sobre Nosotros"
        phrase="Somos un equipo apasionado por la Patagonia, dedicados a brindar experiencias de traslado seguras, puntuales y memorables."
        image="portada_car.jpeg"
        highlightText="Blue Calafate"
        serviceType="Choferes Profesionales"
        dailyDepartures="Atención Personalizada"
      />

      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', color: '#0a1445', marginBottom: '16px' }}>
            Nuestra Flota y Compromiso
          </h2>
          <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '750px', margin: '0 auto' }}>
            Contamos con unidades modernas, habilitadas y equipadas para el confort en los caminos patagónicos.
          </p>
        </div>

        <div className="conteiner-cards">
          <CardTravel img="spin_car.png" capacidad={4} />
          <CardTravel img="expert_car.webp" capacidad={6} />
          <CardTravel img="h1_car.png" capacidad={11} />
          <CardTravel img="sprinter9plus1.png" capacidad={9} />
          <CardTravel img="sprinter19plus1.png" capacidad={19} />
        </div>
      </section>

      <Banda_Beneficios />
    </>
  );
}

export default OurTeamPage;
