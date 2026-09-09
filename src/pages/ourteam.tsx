import { useTranslation } from 'react-i18next';
import { Portada } from '../components/portada/portada';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import VehicleCarousel from '../components/vehicle_carousel/VehicleCarousel';
import './ourteam.css';

export function OurTeamPage() {
  const { t } = useTranslation();

  return (
    <>
      <Portada
        place={t('portada.about_title', 'Sobre Nosotros')}
        phrase={t('portada.about_phrase', 'Somos un equipo apasionado por la Patagonia, dedicados a brindar experiencias de traslado seguras, puntuales y memorables.')}
        image="portada_car_.jpg"
        highlightText={t('portada.about_highlight', 'Blue Calafate')}
        serviceType={t('portada.professional_drivers', 'Choferes Profesionales')}
        dailyDepartures={t('portada.personalized_attention', 'Atención Personalizada')}
      />

      <VehicleCarousel
        title={t('fleet.about_title', 'Nuestra Flota y Compromiso')}
        subtitle={t('fleet.about_subtitle', 'Contamos con unidades modernas, habilitadas y equipadas para el confort en los caminos patagónicos.')}
      />

      <Banda_Beneficios />
    </>
  );
}

export default OurTeamPage;

