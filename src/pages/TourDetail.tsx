import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import type { Tour, PromotionSettings } from '../types';
import { tourService, promotionService } from '../services';
import { Portada } from '../components/portada/portada';
import { BannerInfo } from '../components/banner_info/banner';
import { BookingFlowContainer } from '../components/booking_flow/BookingFlowContainer';
import { Banda_Beneficios } from '../components/banda_beneficios/banda_beneficios';
import promoLimitImg from '../assets/promo_limit.jpeg';
import './TourDetail.css';

export function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoAlertActive, setPromoAlertActive] = useState(true);
  const [promoSettings, setPromoSettings] = useState<PromotionSettings | null>(null);

  // Form & Modality State
  const [serviceMode, setServiceMode] = useState<'shared' | 'private'>('shared');
  const [selectedShift, setSelectedShift] = useState<'08:00 hs' | '14:00 hs'>('08:00 hs');
  const [customDepartureTime, setCustomDepartureTime] = useState('09:00');
  const [customReturnTime, setCustomReturnTime] = useState('16:00');
  const [passengersCount, setPassengersCount] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo / Cash');
  const [date, setDate] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');

  useEffect(() => {
    async function loadTour() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [data, pSettings] = await Promise.all([
          tourService.getBySlug(slug),
          promotionService.getSettings(),
        ]);
        setTour(data);
        setPromoSettings(pSettings);
        setPromoAlertActive(pSettings.tourLimitAlertActive);
      } catch (err) {
        console.error('Error cargando tour:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTour();

    const handlePromoUpdate = async () => {
      try {
        const settings = await promotionService.getSettings();
        setPromoSettings(settings);
        setPromoAlertActive(settings.tourLimitAlertActive);
      } catch (err) {
        console.error('Error updating promo alert settings:', err);
      }
    };
    window.addEventListener('promo_settings_updated', handlePromoUpdate);
    return () => window.removeEventListener('promo_settings_updated', handlePromoUpdate);
  }, [slug]);

  if (loading) {
    return (
      <div className="tour-loading-container">
        <h2 className="tour-loading-title">Cargando información del destino...</h2>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-notfound-container">
        <h2 className="tour-notfound-title">Destino no encontrado</h2>
        <p className="tour-notfound-text">
          El servicio o excursión que buscas no existe o ha sido movido.
        </p>
        <Link to="/" className="tour-notfound-btn">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const hasModalitySwitch = tour.hasPrivateOption !== false;
  const isPrivate = serviceMode === 'private';
  const surchargePct = promoSettings?.promoCreditCardSurcharge ?? 15;

  // Pricing calculation
  const defaultPrivatePrice = Math.round((tour.priceNumber || 35000) * 1.85);
  const unitPriceNumber = isPrivate
    ? (tour.privatePriceNumber || defaultPrivatePrice)
    : (tour.priceNumber || 35000);

  const unitPriceFormatted = isPrivate
    ? (tour.privatePricePerPerson || `ARS $${unitPriceNumber.toLocaleString('es-AR')}`)
    : (tour.pricePerPerson || `ARS $${unitPriceNumber.toLocaleString('es-AR')}`);

  // Base calculation up to 4 passengers; if > 4, quote is custom
  const isMoreThanFour = passengersCount > 4;
  const baseTotalNumber = unitPriceNumber * (isMoreThanFour ? 4 : passengersCount);
  const isCreditCard = paymentMethod === 'Tarjeta';
  const finalTotalNumber = isCreditCard
    ? Math.round(baseTotalNumber * (1 + surchargePct / 100))
    : baseTotalNumber;

  const formattedTotal = isMoreThanFour
    ? 'A consultar (Grupo +4 pax)'
    : `ARS $${finalTotalNumber.toLocaleString('es-AR')}`;

  // Time details for banner and summary
  const hasMultipleSharedShifts =
    Boolean(tour.sharedDepartureTimes && tour.sharedDepartureTimes.length > 1) ||
    tour.departureTime.includes('/');

  const effectiveDeparture = isPrivate
    ? `${customDepartureTime} hs (A tu elección)`
    : hasMultipleSharedShifts
      ? selectedShift
      : tour.departureTime;

  const effectiveReturn = isPrivate
    ? `${customReturnTime} hs (A convenir)`
    : hasMultipleSharedShifts
      ? selectedShift === '08:00 hs'
        ? '14:00 hs'
        : '19:30 hs'
      : tour.returnTime;

  const heroPhrase = isPrivate
    ? (tour.privatePhrase ||
      `Traslado privado exclusivo a ${tour.place || tour.title}. Viajá a tu propio ritmo con vehículo y chofer a tu disposición, eligiendo tu horario de salida y regreso.`)
    : tour.phrase;

  const heroHighlight = isPrivate ? 'Privado VIP' : 'Compartido';

  const heroServiceType = isPrivate
    ? 'Servicio Privado Exclusivo VIP'
    : (tour.serviceType || 'Servicio Compartido');

  return (
    <>
      <Portada
        place={tour.place}
        phrase={heroPhrase}
        image={tour.image}
        highlightText={heroHighlight}
        serviceType={heroServiceType}
        dailyDepartures={
          isPrivate
            ? 'Salidas a tu elección (Hasta 4 personas)'
            : `Salida ${effectiveDeparture} (Hasta 4 personas)`
        }
      />

      <BannerInfo
        departureTime={effectiveDeparture}
        returnTime={effectiveReturn}
        serviceMode={serviceMode}
        hasModalitySwitch={hasModalitySwitch}
        onServiceModeChange={setServiceMode}
      />

      <BookingFlowContainer
        tour={tour}
        serviceMode={serviceMode}
        onServiceModeChange={setServiceMode}
        selectedShift={selectedShift}
        onShiftChange={setSelectedShift}
        customDepartureTime={customDepartureTime}
        onCustomDepartureChange={setCustomDepartureTime}
        customReturnTime={customReturnTime}
        onCustomReturnChange={setCustomReturnTime}
        passengersCount={passengersCount}
        onPassengersCountChange={setPassengersCount}
        date={date}
        onDateChange={setDate}
        passengerName={passengerName}
        onPassengerNameChange={setPassengerName}
        passengerPhone={passengerPhone}
        onPassengerPhoneChange={setPassengerPhone}
        passengerEmail={passengerEmail}
        onPassengerEmailChange={setPassengerEmail}
        meetingPoint={meetingPoint}
        onMeetingPointChange={setMeetingPoint}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        creditCardSurcharge={surchargePct}
        calculatedTotal={formattedTotal}
        effectiveDeparture={effectiveDeparture}
        effectiveReturn={effectiveReturn}
        unitPriceFormatted={unitPriceFormatted}
      />

      {promoAlertActive && (
        <div className="pm-promo-container-bottom">
          <Link
            to="/promocion"
            className="pm-promo-limit-card pm-promo-limit-card-horizontal"
            title="¡Ver detalles de la promoción limitada!"
          >
            <img
              src={promoLimitImg}
              alt="Promoción Limitada - Consultá Disponibilidad"
              className="pm-promo-limit-img"
            />
          </Link>
        </div>
      )}

      <Banda_Beneficios />
    </>
  );
}

export default TourDetail;
