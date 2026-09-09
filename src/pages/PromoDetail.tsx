import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Portada } from '../components/portada/portada';
import { BannerInfo } from '../components/banner_info/banner';
import FormularioReserva from '../components/formulario/form_reserva';
import { Resumen_reserva } from '../components/resumen_reserva/resumen_reserva';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import { promotionService, vehicleService, tourService } from '../services';
import type { Promotion, Vehicle, Tour } from '../types';
import promoLimitImg from '../assets/promo_limit.png';
import './PromoDetail.css';

// Helper para resolver URLs de imágenes (data URL, http, asset local)
const getPromoImageSrc = (imgPath?: string) => {
  if (!imgPath || typeof imgPath !== 'string') return '';
  if (
    imgPath.startsWith('http://') ||
    imgPath.startsWith('https://') ||
    imgPath.startsWith('data:') ||
    imgPath.startsWith('blob:') ||
    imgPath.startsWith('/')
  ) {
    return imgPath;
  }
  try {
    return new URL(`../assets/${imgPath}`, import.meta.url).href;
  } catch {
    return imgPath;
  }
};

export function PromoDetail() {
  const { slug } = useParams<{ slug?: string }>();

  const [promo, setPromo] = useState<Promotion | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState('Efectivo / Cash');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [promosList, vehiclesList, toursList] = await Promise.all([
          promotionService.getAll(),
          vehicleService.getAll(),
          tourService.getAll(),
        ]);

        if (!isMounted) return;

        setVehicles(vehiclesList);
        setTours(toursList);

        let selectedPromo: Promotion | undefined;

        if (slug) {
          const cleanSlug = slug.toLowerCase().trim();
          selectedPromo = promosList.find(
            (p) =>
              p.slug.toLowerCase() === cleanSlug ||
              p.id.toLowerCase() === cleanSlug
          );

          if (!selectedPromo) {
            try {
              selectedPromo = await promotionService.getById(slug);
            } catch {
              // Si no se encuentra por getById, se mantiene undefined
            }
          }
        }

        // Si no se pasó slug o no se encontró por slug, tomar la primera promo activa
        if (!selectedPromo) {
          selectedPromo =
            promosList.find((p) => p.isActive && p.showHomeModal !== false) ||
            promosList.find((p) => p.isActive) ||
            promosList[0];
        }

        if (selectedPromo) {
          setPromo(selectedPromo);
          document.title = `${selectedPromo.title} - Blue Calafate`;
        } else {
          setError('No se encontró la promoción solicitada.');
        }
      } catch (err) {
        console.error('Error cargando los detalles de la promoción:', err);
        if (isMounted) setError('Error al cargar la información de la promoción.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', minHeight: '60vh' }}>
        <i
          className="fi fi-rr-spinner"
          style={{ fontSize: '40px', color: '#0284c7', display: 'inline-block', animation: 'spin 1s linear infinite' }}
        ></i>
        <h2 style={{ marginTop: '16px', color: '#1e293b' }}>Cargando promoción...</h2>
      </div>
    );
  }

  if (error || !promo) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <i className="fi fi-rr-exclamation" style={{ fontSize: '48px', color: '#dc2626' }}></i>
        <h2 style={{ marginTop: '16px', color: '#1e293b' }}>Promoción no encontrada</h2>
        <p style={{ color: '#64748b', maxWidth: '500px', margin: '10px auto 24px' }}>
          {error || 'La promoción que buscas no está disponible o ha caducado.'}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0284c7',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '24px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          <i className="fi fi-rr-arrow-left"></i> Volver al Inicio
        </Link>
      </div>
    );
  }

  // Resolver vehículo asignado
  const assignedVehicle = vehicles.find((v) => v.id === promo.vehicleId);
  const passengersCount = promo.passengersCount || assignedVehicle?.capacity || 4;
  const basePrice = promo.priceNumber || 180000;
  const surchargePct = promo.creditCardSurcharge ?? 15;

  // Cálculo de precio según método de pago
  const isCreditCard = paymentMethod === 'Tarjeta';
  const finalPriceNumber = isCreditCard
    ? Math.round(basePrice * (1 + surchargePct / 100))
    : basePrice;

  const formattedBasePrice = promo.priceText || `ARS $${basePrice.toLocaleString('es-AR')}`;
  const formattedFinalPrice = `ARS $${finalPriceNumber.toLocaleString('es-AR')}`;
  const cardPriceNumber = Math.round(basePrice * (1 + surchargePct / 100));

  // Resolver tours incluidos
  const matchedIncludedTours = (promo.includedTourIds || [])
    .map((tourId) => tours.find((t) => t.id === tourId))
    .filter((t): t is Tour => t !== undefined);

  return (
    <>
      <img
        src={promoLimitImg}
        alt="Promoción Especial"
        className="promo-flyer-alert-img"
      />

      <Portada
        place={promo.title}
        phrase={promo.subtitle}
        image={promo.image || 'portada_car.jpeg'}
        highlightText={promo.badgeText || 'PROMOCIÓN EXCLUSIVA'}
        serviceType={
          assignedVehicle
            ? `${assignedVehicle.name} • Traslado Privado`
            : 'Traslado Privado Exclusivo'
        }
        dailyDepartures="Horarios a Coordinar"
      />

      <BannerInfo
        departureTime="A convenir según vuelos / itinerario"
        returnTime="A convenir"
        scheduleLabel="Servicio Privado Exclusivo"
      />

      {/* Sección descriptiva del paquete de promoción */}
      <section className="promo-package-section">
        <div className="promo-package-container">
          <div className="promo-badge-alert">
            <span className="promo-badge-pulse"></span>
            ¡{promo.badgeText || 'OFERTA ESPECIAL POR TIEMPO LIMITADO'}!
          </div>

          <h2 className="promo-package-title">{promo.title}</h2>
          <p className="promo-package-subtitle">{promo.subtitle}</p>

          {/* Tarjeta de Precios y Financiación */}
          <div className="promo-pricing-highlight-box">
            <div className="promo-pricing-item">
              <span className="promo-pricing-label">Precio Total Promo:</span>
              <strong className="promo-pricing-value">{formattedBasePrice}</strong>
              <small className="promo-pricing-sub">Efectivo / Transferencia</small>
            </div>
            {surchargePct > 0 && (
              <div className="promo-pricing-card-badge">
                <i className="fi fi-rr-credit-card"></i>
                <span>
                  Pagos con Tarjeta de Crédito: <strong>ARS ${cardPriceNumber.toLocaleString('es-AR')}</strong> (+{surchargePct}%)
                </span>
              </div>
            )}
          </div>

          {/* Grilla de Excursiones / Servicios Incluidos */}
          <div className="promo-cards-grid">
            {matchedIncludedTours.length > 0 ? (
              matchedIncludedTours.map((tour) => (
                <div key={tour.id} className="promo-feature-card">
                  <div className="promo-feature-icon">
                    <i className={tour.logoIcon || 'fi fi-rr-map-marker'}></i>
                  </div>
                  <div className="promo-feature-tag">INCLUIDO</div>
                  <h3>{tour.title}</h3>
                  <p>{tour.phrase || tour.place}</p>
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '12px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fi fi-rr-clock" style={{ color: '#0284c7' }}></i>
                    <span>{tour.departureTime || 'A coordinar'} • {tour.serviceType}</span>
                  </div>
                </div>
              ))
            ) : promo.includes && promo.includes.length > 0 ? (
              promo.includes.map((item, idx) => (
                <div key={idx} className="promo-feature-card">
                  <div className="promo-feature-icon">
                    <i className="fi fi-rr-check-circle"></i>
                  </div>
                  <div className="promo-feature-tag">INCLUIDO</div>
                  <h3>{item}</h3>
                  <p>
                    Servicio exclusivo incluido en la promoción para tu grupo con máxima puntualidad y confort.
                  </p>
                </div>
              ))
            ) : (
              <div className="promo-feature-card">
                <div className="promo-feature-icon">
                  <i className="fi fi-rr-star"></i>
                </div>
                <div className="promo-feature-tag">PAQUETE COMPLETO</div>
                <h3>Traslados y Excursiones</h3>
                <p>Todos los traslados y excursiones detallados en el paquete con chofer a disposición.</p>
              </div>
            )}
          </div>

          {/* Barra de Beneficios del Vehículo y Servicio */}
          <div className="promo-car-benefits">
            <div className="promo-car-item">
              <i className="fi fi-rr-users-alt"></i>
              <span>
                {assignedVehicle
                  ? `${assignedVehicle.name} (Hasta ${passengersCount} Pax)`
                  : `Hasta ${passengersCount} Personas`}
              </span>
            </div>
            <div className="promo-car-item">
              <i className="fi fi-rr-suitcase-alt"></i>
              <span>
                {assignedVehicle?.luggageCapacity
                  ? `Equipaje: ${assignedVehicle.luggageCapacity} Valijas`
                  : 'Equipaje Amplio'}
              </span>
            </div>
            <div className="promo-car-item">
              <i className="fi fi-rr-shield-check"></i>
              <span>Choferes Profesionales</span>
            </div>
            <div className="promo-car-item">
              <i className="fi fi-rr-calendar-clock"></i>
              <span>Servicio Todo el Año</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid con formulario y resumen de reserva */}
      <div className="pm-grid">
        <FormularioReserva
          tourTitle={promo.title}
          departureTime="A convenir según vuelos"
          returnTime="A convenir"
          passengers={`${passengersCount} pasajeros`}
          isPromo={true}
          promoPassengersCount={passengersCount}
          selectedPaymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          creditCardSurcharge={surchargePct}
          calculatedTotal={formattedFinalPrice}
        />

        <div className="pm-sidebar-column">
          <Resumen_reserva
            tourTitle={promo.title}
            departureTime="A coordinar"
            returnTime="A coordinar"
            pricePerPerson={isCreditCard ? `Tarjeta (+${surchargePct}%)` : 'Efectivo / Transf.'}
            totalAmount={formattedFinalPrice}
            image={getPromoImageSrc(promo.image) || 'promo4p.jpeg'}
          />
        </div>
      </div>

      <Banda_Beneficios />
    </>
  );
}

export default PromoDetail;