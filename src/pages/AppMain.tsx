import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ToursContainer from '../components/tours_container/ToursContainer';
import PromoCardsContainer from '../components/promo_cards_container/PromoCardsContainer';
import VehicleCarousel from '../components/vehicle_carousel/VehicleCarousel';
import AdsContainer from '../components/ads_container/AdsContainer';
import TicketParque from '../components/ticket_parque/ticket_parque';
import { Portada } from '../components/portada/portada';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import type { Tour, Vehicle, Promotion } from '../types';
import { tourService, vehicleService, promotionService } from '../services';
import promoImg from '../assets/promo4p.jpeg';
import './AppMain.css';

// Bandera a nivel de módulo: se mantiene en true durante la navegación en la app,
// y solo se reinicia a false cuando el usuario recarga / refresca la página (F5 / reload).
let promoModalDismissedThisSession = false;

function AppMain() {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  const [activePromo, setActivePromo] = useState<Promotion | null>(null);

  const handleClosePromo = () => {
    promoModalDismissedThisSession = true;
    setShowPromo(false);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [toursRes, vehiclesRes, activePromos] = await Promise.all([
          tourService.getAll(),
          vehicleService.getAll(),
          promotionService.getActive(),
        ]);

        if (!isMounted) return;

        setTours(toursRes);
        setVehicles(vehiclesRes);

        const promoForModal = activePromos.find((p) => p.showHomeModal !== false);
        if (promoForModal) {
          setActivePromo(promoForModal);
          if (!promoModalDismissedThisSession) {
            setShowPromo(true);
          }
        } else {
          setActivePromo(null);
          setShowPromo(false);
        }
      } catch (err) {
        console.error('Error cargando datos principales:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();

    const handlePromoUpdate = async () => {
      if (promoModalDismissedThisSession) return;
      try {
        const activePromos = await promotionService.getActive();
        if (!isMounted) return;

        const promoForModal = activePromos.find((p) => p.showHomeModal !== false);
        if (promoForModal) {
          setActivePromo(promoForModal);
          setShowPromo(true);
        } else {
          setActivePromo(null);
          setShowPromo(false);
        }
      } catch (err) {
        console.error('Error actualizando configuración de promo:', err);
      }
    };

    window.addEventListener('promo_settings_updated', handlePromoUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('promo_settings_updated', handlePromoUpdate);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePromo();
      }
    };
    if (showPromo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPromo]);

  const promoImgSrc = activePromo?.image
    ? activePromo.image.startsWith('http') || activePromo.image.startsWith('/')
      ? activePromo.image
      : new URL(`../assets/${activePromo.image}`, import.meta.url).href
    : promoImg;

  return (
    <>
      <Portada
        place={t('portada.home_title', 'Traslados en el sur de Argentina')}
        phrase={t('portada.home_phrase', 'Traslados compartidos y privados en El Calafate y El Chaltén. Cómodo, seguro y económico.')}
        image="portada_car_.jpg"
        highlightText={t('portada.home_highlight', 'Patagonia')}
        serviceType={t('portada.service_type_exclusive', 'Servicio Exclusivo')}
        dailyDepartures={t('portada.daily_departures', 'Salidas diarias')}
      />

      <PromoCardsContainer />

      <ToursContainer
        tours={tours}
        loading={loading}
      />

      <TicketParque />

      <VehicleCarousel
        vehicles={vehicles}
        title={t('fleet.title', 'Nuestra Flota de Vehículos')}
        subtitle={t('fleet.subtitle', 'Unidades modernas y confortables adaptadas a cada necesidad')}
      />

      <AdsContainer />

      <Banda_Beneficios />

      {showPromo && (
        <div
          className="promo-modal-overlay"
          onClick={handleClosePromo}
        >
          <div
            className="promo-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t('promo.special_promo', 'Promoción especial')}
          >
            <button
              className="promo-modal-close"
              onClick={handleClosePromo}
              aria-label={t('promo.close', 'Cerrar publicidad')}
              type="button"
            >
              <i className="fi fi-rr-cross"></i>
            </button>
            <div className="promo-modal-body">
              <Link
                to={activePromo ? `/promocion/${activePromo.slug || activePromo.id}` : '/promocion'}
                onClick={handleClosePromo}
                className="promo-modal-img-link"
                title={activePromo?.title || t('promo.view_promo', 'Ver promoción especial')}
              >
                <img
                  src={promoImgSrc}
                  alt={activePromo?.title || t('promo.special_promo', 'Promoción especial')}
                  className="promo-modal-img"
                />
              </Link>
              <div className="promo-modal-footer">
                <Link
                  to={activePromo ? `/promocion/${activePromo.slug || activePromo.id}` : '/promocion'}
                  className="promo-modal-btn-action"
                  onClick={handleClosePromo}
                >
                  <i className="fi fi-rr-tags"></i> {t('promo.view_promo', 'Ver Promoción')}
                </Link>
                <button
                  type="button"
                  className="promo-modal-btn-close"
                  onClick={handleClosePromo}
                >
                  {t('promo.close', 'Cerrar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppMain;