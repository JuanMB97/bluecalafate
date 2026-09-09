import React, { useState, useRef } from 'react';
import type { Tour } from '../../types';
import TourInfoCard from '../tour_info/TourInfoCard';
import FormularioReserva from '../formulario/form_reserva';
import Resumen_reserva from '../resumen_reserva/resumen_reserva';
import './BookingFlowContainer.css';

export interface BookingFlowContainerProps {
  tour: Tour;
  serviceMode: 'shared' | 'private';
  onServiceModeChange: (mode: 'shared' | 'private') => void;
  selectedShift: '08:00 hs' | '14:00 hs';
  onShiftChange: (shift: '08:00 hs' | '14:00 hs') => void;
  customDepartureTime: string;
  onCustomDepartureChange: (time: string) => void;
  customReturnTime: string;
  onCustomReturnChange: (time: string) => void;
  passengersCount: number;
  onPassengersCountChange: (count: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  passengerName: string;
  onPassengerNameChange: (name: string) => void;
  passengerPhone: string;
  onPassengerPhoneChange: (phone: string) => void;
  passengerEmail: string;
  onPassengerEmailChange: (email: string) => void;
  meetingPoint: string;
  onMeetingPointChange: (point: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  creditCardSurcharge: number;
  calculatedTotal: string;
  effectiveDeparture: string;
  effectiveReturn: string;
  unitPriceFormatted: string;
}

export type BookingStep = 1 | 2 | 3;

export const BookingFlowContainer: React.FC<BookingFlowContainerProps> = ({
  tour,
  serviceMode,
  onServiceModeChange,
  selectedShift,
  onShiftChange,
  customDepartureTime,
  onCustomDepartureChange,
  customReturnTime,
  onCustomReturnChange,
  passengersCount,
  onPassengersCountChange,
  date,
  onDateChange,
  passengerName,
  onPassengerNameChange,
  passengerPhone,
  onPassengerPhoneChange,
  passengerEmail,
  onPassengerEmailChange,
  meetingPoint,
  onMeetingPointChange,
  paymentMethod,
  onPaymentMethodChange,
  creditCardSurcharge,
  calculatedTotal,
  effectiveDeparture,
  effectiveReturn,
  unitPriceFormatted,
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPrivate = serviceMode === 'private';
  const hasModalitySwitch = tour.hasPrivateOption !== false;

  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const stepsMeta = [
    {
      number: 1,
      title: 'Información',
      subtitle: 'Itinerario y modalidad',
      icon: 'fi fi-sr-route',
    },
    {
      number: 2,
      title: 'Datos de Reserva',
      subtitle: 'Horarios y pasajeros',
      icon: 'fi fi-sr-edit',
    },
    {
      number: 3,
      title: 'Confirmación',
      subtitle: 'Resumen y WhatsApp',
      icon: 'fi fi-sr-badge-check',
    },
  ];

  return (
    <div className={`booking-flow-section ${isPrivate ? 'flow-private-mode' : ''}`} ref={containerRef}>
      {/* Barra de progreso / Stepper Navigation */}
      <div className="booking-stepper-header">
        <div className="booking-stepper-track">
          <div
            className={`booking-stepper-progress-fill ${isPrivate ? 'fill-gold' : 'fill-blue'}`}
            style={{
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            }}
          />
        </div>

        <div className="booking-stepper-items">
          {stepsMeta.map((s) => {
            const isActive = currentStep === s.number;
            const isCompleted = currentStep > s.number;
            const isClickable = s.number < currentStep;

            return (
              <button
                key={s.number}
                type="button"
                className={`booking-step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''} ${isPrivate ? 'step-gold' : ''}`}
                onClick={() => {
                  if (isClickable) {
                    goToStep(s.number as BookingStep);
                  }
                }}
                disabled={!isClickable && !isActive}
              >
                <div className="booking-step-icon-wrap">
                  {isCompleted ? (
                    <i className="fi fi-rr-check"></i>
                  ) : (
                    <span>{s.number}</span>
                  )}
                </div>
                <div className="booking-step-info">
                  <strong className="booking-step-title">{s.title}</strong>
                  <span className="booking-step-sub">{s.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor del paso activo */}
      <div className="booking-flow-content">
        {currentStep === 1 && (
          <div className="booking-step-view booking-step-view-info">
            <TourInfoCard
              tour={tour}
              serviceMode={serviceMode}
              onServiceModeChange={onServiceModeChange}
              onProceedToForm={() => goToStep(2)}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="booking-step-view booking-step-view-form">
            <FormularioReserva
              tourTitle={tour.title}
              serviceMode={serviceMode}
              hasModalitySwitch={hasModalitySwitch}
              onServiceModeChange={onServiceModeChange}
              departureTime={effectiveDeparture}
              returnTime={effectiveReturn}
              selectedShift={selectedShift}
              onShiftChange={onShiftChange}
              customDepartureTime={customDepartureTime}
              onCustomDepartureChange={onCustomDepartureChange}
              customReturnTime={customReturnTime}
              onCustomReturnChange={onCustomReturnChange}
              passengersCount={passengersCount}
              onPassengersCountChange={onPassengersCountChange}
              date={date}
              onDateChange={onDateChange}
              passengerName={passengerName}
              onPassengerNameChange={onPassengerNameChange}
              passengerPhone={passengerPhone}
              onPassengerPhoneChange={onPassengerPhoneChange}
              passengerEmail={passengerEmail}
              onPassengerEmailChange={onPassengerEmailChange}
              meetingPoint={meetingPoint}
              onMeetingPointChange={onMeetingPointChange}
              selectedPaymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
              creditCardSurcharge={creditCardSurcharge}
              calculatedTotal={calculatedTotal}
              onFinalize={() => goToStep(3)}
              onBackToInfo={() => goToStep(1)}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="booking-step-view booking-step-view-summary">
            <div className="booking-summary-wrapper">
              <Resumen_reserva
                tourTitle={tour.title}
                serviceMode={serviceMode}
                departureTime={effectiveDeparture}
                returnTime={effectiveReturn}
                pricePerPerson={unitPriceFormatted}
                totalAmount={calculatedTotal}
                image={tour.tourCardImg}
                date={date}
                passengersCount={passengersCount}
                passengerName={passengerName}
                meetingPoint={meetingPoint}
                paymentMethod={paymentMethod}
                onBackToForm={() => goToStep(2)}
                onBackToInfo={() => goToStep(1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlowContainer;
