import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Portada } from '../components/portada/portada';
import ToursContainer from '../components/tours_container/ToursContainer';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import type { Tour } from '../types';
import { tourService } from '../services';
import './services.css';

function ServiceApp() {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        const data = await tourService.getAll();
        setTours(data);
      } catch (err) {
        console.error('Error al cargar excursiones:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTours();
  }, []);

  return (
    <>
      <Portada
        place={t('portada.services_title', 'Nuestros Servicios')}
        phrase={t('portada.services_phrase', 'Traslados privados, compartidos y excursiones personalizadas en El Calafate y El Chaltén.')}
        image="portada_tours.jpg"
        highlightText={t('portada.services_highlight', 'Premium')}
        serviceType={t('portada.service_type_exclusive', 'Servicio Exclusivo')}
        dailyDepartures={t('portada.support_24_7', 'Atención 24/7')}
      />

      <ToursContainer
        tours={tours}
        loading={loading}
        title={t('services_page.title', 'Excursiones y Traslados Disponibles')}
        subtitle={t('services_page.subtitle', 'Selecciona cualquiera de nuestros destinos para ver horarios, precios y reservar directamente por WhatsApp.')}
        badge={t('services_page.badge', 'NUESTROS SERVICIOS')}
      />

      <Banda_Beneficios />
    </>
  );
}

export default ServiceApp;