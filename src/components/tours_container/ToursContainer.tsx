import { useEffect, useState } from 'react';
import TourCard from '../tour_card/tour_card';
import { tourService } from '../../services';
import type { Tour, ToursContainerProps } from '../../types';
import './ToursContainer.css';

export function ToursContainer({
  tours: initialTours,
  loading: externalLoading,
  title = 'Nuestros destinos y traslados',
  subtitle = 'Descubrí los mejores destinos y paisajes de la Patagonia con el confort, seguridad y puntualidad que te merecés.',
  badge = 'DESTINOS DESTACADOS',
}: ToursContainerProps) {
  const [tours, setTours] = useState<Tour[]>(initialTours || []);
  const [loading, setLoading] = useState(
    externalLoading !== undefined ? externalLoading : (!initialTours || initialTours.length === 0)
  );

  useEffect(() => {
    if (initialTours && initialTours.length > 0) {
      setTours(initialTours);
      if (externalLoading !== undefined) {
        setLoading(externalLoading);
      } else {
        setLoading(false);
      }
      return;
    }

    if (externalLoading !== undefined) {
      setLoading(externalLoading);
    }

    let isMounted = true;
    async function fetchTours() {
      try {
        const data = await tourService.getAll();
        if (isMounted) {
          setTours(data);
        }
      } catch (err) {
        console.error('Error cargando lista de tours:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTours();

    return () => {
      isMounted = false;
    };
  }, [initialTours, externalLoading]);

  return (
    <section className="tours-container-section">
      <div className="tours-container-header">
        {badge && (
          <div className="tours-badge">
            <i className="fi fi-rr-compass"></i>
            <span>{badge}</span>
          </div>
        )}
        {title && <h2 className="tours-container-title">{title}</h2>}
        {subtitle && <p className="tours-container-subtitle">{subtitle}</p>}
      </div>

      <div className="tours-grid-wrapper">
        {loading ? (
          <div className="tours-loading-box">
            <i className="fi fi-rr-spinner"></i>
            <p>Cargando excursiones y traslados...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="tours-empty-box">
            <i className="fi fi-rr-info"></i>
            <p>No hay excursiones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="tours-grid">
            {tours.map((tour) => (
              <div key={tour.id} className="tours-grid-item">
                <TourCard key={tour.id} {...tour} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ToursContainer;
