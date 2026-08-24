import { Portada } from '../components/portada/portada';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import whatsappIco from '../assets/whatsapp.png';
import logoEmail from '../assets/logo_email.png';
import logoAddress from '../assets/logo_address.png';


export function ContactPage() {
  return (
    <>
      <Portada
        place="Contacto y Reservas"
        phrase="¿Tienes dudas sobre traslados o excursiones? Escríbenos directamente y te responderemos al instante."
        image="portada.jpg"
        highlightText="Directo"
        serviceType="Respuesta Rápida"
        dailyDepartures="Guardias 24hs"
      />

      <section style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', color: '#0a1445', marginBottom: '12px' }}>
            Medios de Contacto Oficiales
          </h2>
          <p style={{ color: '#64748b', fontSize: '18px' }}>
            Estamos a tu disposición para planificar tu viaje por la Patagonia.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '50px',
          }}
        >
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            <img src={whatsappIco} alt="WhatsApp" style={{ height: '48px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', color: '#0a1445', marginBottom: '8px' }}>WhatsApp</h3>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Atención inmediata</p>
            <a
              href="https://wa.me/5492966764900"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block',
              }}
            >
              +54 9 2966 764900
            </a>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            <img src={logoEmail} alt="Email" style={{ height: '48px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', color: '#0a1445', marginBottom: '8px' }}>Correo Electrónico</h3>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Cotizaciones y consultas</p>
            <a
              href="mailto:bluecalafatepatagonia@gmail.com"
              style={{ color: '#0d47ff', fontWeight: 600, wordBreak: 'break-all' }}
            >
              bluecalafatepatagonia@gmail.com
            </a>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            <img src={logoAddress} alt="Ubicación" style={{ height: '48px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', color: '#0a1445', marginBottom: '8px' }}>Ubicación</h3>
            <p style={{ color: '#64748b' }}>El Calafate, Santa Cruz, Patagonia Argentina</p>
          </div>
        </div>
      </section>

      <Banda_Beneficios />
    </>
  );
}

export default ContactPage;
