import { useEffect, useState, useRef } from 'react';
import CardTravel from '../card-travel/card_travel';
import { vehicleService } from '../../services';
import type { Vehicle, VehicleCarouselProps } from '../../types';
import './VehicleCarousel.css';

export function VehicleCarousel({
  vehicles: initialVehicles,
  title,
  subtitle,
}: VehicleCarouselProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);
  const [loading, setLoading] = useState(!initialVehicles || initialVehicles.length === 0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialVehicles && initialVehicles.length > 0) {
      setVehicles(initialVehicles);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadVehicles() {
      try {
        const data = await vehicleService.getAll();
        if (isMounted) {
          setVehicles(data);
        }
      } catch (err) {
        console.error('Error fetching vehicles for carousel:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, [initialVehicles]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="vehicle-carousel-section">
        <div className="vehicle-carousel-loading">
          <i className="fi fi-rr-spinner"></i> Cargando flota de vehículos...
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return null;
  }

  // Duplicate vehicles array multiple times to create a seamless infinite marquee
  const displayVehicles = [...vehicles, ...vehicles, ...vehicles, ...vehicles];

  return (
    <section className="vehicle-carousel-section">
      {(title || subtitle) && (
        <div className="vehicle-carousel-header">
          {title && <h2 className="vehicle-carousel-title">{title}</h2>}
          {subtitle && <p className="vehicle-carousel-subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="vehicle-carousel-wrapper">
        <button
          type="button"
          className="vehicle-carousel-nav-btn prev"
          onClick={scrollLeft}
          aria-label="Anterior vehículo"
        >
          <i className="fi fi-rr-angle-left"></i>
        </button>

        <div className="vehicle-carousel-viewport" ref={containerRef}>
          <div className="vehicle-carousel-track">
            {displayVehicles.map((v, index) => (
              <div
                key={`${v.id}-${index}`}
                className="vehicle-carousel-item"
              >
                <CardTravel
                  img={v.image}
                  capacidad={v.capacity}
                  name={v.name}
                  luggageCapacity={v.luggageCapacity}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="vehicle-carousel-nav-btn next"
          onClick={scrollRight}
          aria-label="Siguiente vehículo"
        >
          <i className="fi fi-rr-angle-right"></i>
        </button>
      </div>
    </section>
  );
}

export default VehicleCarousel;
