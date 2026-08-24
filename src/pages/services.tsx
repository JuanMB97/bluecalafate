import { useState, useEffect } from 'react';
import { Portada } from '../components/portada/portada';
import TourCard from '../components/tour_card/tour_card';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import type { Tour } from '../types';
import { tourService } from '../services';

function ServiceApp() {
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
        place="Nuestros Servicios"
        phrase="Traslados privados, compartidos y excursiones personalizadas en El Calafate y El Chaltén."
        image="portada.jpg"
        highlightText="Premium"
        serviceType="Servicio Exclusivo"
        dailyDepartures="Atención 24/7"
      />

      <div style={{ maxWidth: '1300px', margin: '40px auto 20px', padding: '0 20px' }}>
        <h2 style={{ fontSize: '32px', color: '#0a1445', marginBottom: '10px' }}>
          Excursiones y Traslados Disponibles
        </h2>
        <p style={{ color: '#64748b' }}>
          Selecciona cualquiera de nuestros destinos para ver horarios, precios y reservar directamente por WhatsApp.
        </p>
      </div>

      <div className="contain-cards-tours">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#0a1445', padding: '40px', fontWeight: 600 }}>
            Cargando destinos...
          </p>
        ) : (
          tours.map((tour) => (
            <TourCard
              key={tour.id}
              linkTour={`/tours/${tour.slug}`}
              tourimg={tour.tourCardImg}
              logo={tour.logoIcon}
              title={tour.title}
              description={tour.phrase}
            />
          ))
        )}
      </div>

      <Banda_Beneficios />
    </>
  );
}

export default ServiceApp;