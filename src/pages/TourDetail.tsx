import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import type { Tour } from '../types';
import { tourService } from '../services';
import { Portada } from '../components/portada/portada';
import { BannerInfo } from '../components/banner_info/banner';
import FormularioReserva from '../components/formulario/form_reserva';
import { Resumen_reserva } from '../components/resumen_reserva/resumen_reserva';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';

export function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTour() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await tourService.getBySlug(slug);
        setTour(data);
      } catch (err) {
        console.error('Error cargando tour:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '28px', color: '#0a1445' }}>Cargando información del destino...</h2>
      </div>
    );
  }

  if (!tour) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '32px', color: '#0a1445', marginBottom: '16px' }}>
          Destino no encontrado
        </h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>
          El servicio o excursión que buscas no existe o ha sido movido.
        </p>
        <Link
          to="/"
          style={{
            background: '#0d47ff',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <Portada
        place={tour.place}
        phrase={tour.phrase}
        image={tour.image}
        highlightText={tour.title}
        serviceType={tour.serviceType}
        dailyDepartures={`Salida ${tour.departureTime}`}
      />

      <BannerInfo
        departureTime={tour.departureTime}
        returnTime={tour.returnTime}
      />

      <div className="pm-grid">
        <FormularioReserva
          tourTitle={tour.title}
          departureTime={tour.departureTime}
          returnTime={tour.returnTime}
        />

        <Resumen_reserva
          tourTitle={tour.title}
          departureTime={tour.departureTime}
          returnTime={tour.returnTime}
          pricePerPerson={tour.pricePerPerson}
          totalAmount={tour.totalExample}
          image={tour.tourCardImg}
        />
      </div>

      <Banda_Beneficios />
    </>
  );
}

export default TourDetail;
