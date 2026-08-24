import { useState, useEffect } from 'react';
import CardTravel from '../components/card-travel/card_travel';
import { Portada } from '../components/portada/portada';
import TourCard from '../components/tour_card/tour_card';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import type { Tour, Vehicle } from '../types';
import { tourService, vehicleService } from '../services';

function AppMain() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [toursRes, vehiclesRes] = await Promise.all([
          tourService.getAll(),
          vehicleService.getAll(),
        ]);
        setTours(toursRes);
        setVehicles(vehiclesRes);
      } catch (err) {
        console.error('Error cargando datos principales:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Portada
        place="Traslados en el sur de Argentina"
        phrase="Traslados compartidos y privados en El Calafate y El Chaltén. Cómodo, seguro y económico."
        image="portada_car.jpeg"
        highlightText="Patagonia"
        serviceType="Servicio Exclusivo"
        dailyDepartures="Salidas diarias"
      />

      <div className="conteiner-cards">
        {vehicles.map((v) => (
          <CardTravel key={v.id} img={v.image} capacidad={v.capacity} />
        ))}
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

export default AppMain;