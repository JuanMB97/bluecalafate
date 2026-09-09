import { useTranslation } from 'react-i18next';
import { Portada } from '../components/portada/portada';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import './Contact.css';

export function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Portada
        place={t('portada.contact_title', 'Contacto y Reservas')}
        phrase={t('portada.contact_phrase', '¿Tienes dudas sobre traslados o excursiones? Escríbenos directamente y te responderemos al instante.')}
        image="portada.jpg"
        highlightText={t('portada.contact_highlight', 'Directo')}
        serviceType={t('portada.fast_response', 'Respuesta Rápida')}
        dailyDepartures={t('portada.guards_24h', 'Guardias 24hs')}
      />

      <section className="contact-section">
        <div className="contact-header">
          <h2>
            {t('contact_page.title', 'Medios de Contacto Oficiales')}
          </h2>
          <p>
            {t('contact_page.subtitle', 'Estamos a tu disposición para planificar tu viaje por la Patagonia.')}
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <i className="fi fi-brands-whatsapp contact-icon icon-whatsapp"></i>
            <h3>{t('contact_page.whatsapp_label', 'WhatsApp')}</h3>
            <p>{t('contact_page.whatsapp_status', 'Atención inmediata')}</p>
            <a
              href="https://wa.me/5492966764900"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-whatsapp-btn"
            >
              +54 9 2966 764900
            </a>
          </div>

          <div className="contact-card">
            <i className="fi fi-rr-envelope contact-icon icon-email"></i>
            <h3>{t('contact_page.email_label', 'Correo Electrónico')}</h3>
            <p>{t('contact_page.email_status', 'Cotizaciones y consultas')}</p>
            <a
              href="mailto:bluecalafatepatagonia@gmail.com"
              className="contact-email-link"
            >
              bluecalafatepatagonia@gmail.com
            </a>
          </div>

          <div className="contact-card">
            <i className="fi fi-rr-marker contact-icon icon-location"></i>
            <h3>{t('contact_page.location_label', 'Ubicación')}</h3>
            <p className="contact-location">{t('contact_page.location_text', 'El Calafate, Santa Cruz, Patagonia Argentina')}</p>
          </div>
        </div>
      </section>

      <Banda_Beneficios />
    </>
  );
}

export default ContactPage;

