import React, { useState } from 'react';
import type { FormularioReservaProps } from '../../types';
import { CustomCalendar } from '../custom_calendar';
import './form_reserva.css';

export const FormularioReserva: React.FC<FormularioReservaProps> = ({
  tourTitle = 'Perito Moreno',
  serviceMode = 'shared',
  hasModalitySwitch = false,
  onServiceModeChange,
  selectedShift = '08:00 hs',
  onShiftChange,
  customDepartureTime = '09:00',
  onCustomDepartureChange,
  customReturnTime = '16:00',
  onCustomReturnChange,
  passengersCount = 2,
  onPassengersCountChange,
  date = '',
  onDateChange,
  passengerName = '',
  onPassengerNameChange,
  passengerPhone = '',
  onPassengerPhoneChange,
  passengerEmail = '',
  onPassengerEmailChange,
  meetingPoint = '',
  onMeetingPointChange,
  isPromo = false,
  promoPassengersCount = 4,
  selectedPaymentMethod,
  onPaymentMethodChange,
  creditCardSurcharge = 0,
  onFinalize,
  onBackToInfo,
}) => {
  const [internalPaymentMethod, setInternalPaymentMethod] = useState('Efectivo / Cash');

  const currentPaymentMethod = selectedPaymentMethod !== undefined
    ? selectedPaymentMethod
    : internalPaymentMethod;

  const handlePaymentChange = (val: string) => {
    setInternalPaymentMethod(val);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(val);
    }
  };

  const isPrivate = serviceMode === 'private';

  return (
    <div className={`pm-form-card ${isPrivate ? 'card-mode-private' : ''}`}>
      {/* Selector de modalidad si aplica */}
      {hasModalitySwitch && onServiceModeChange && (
        <div className="form-modality-header">
          <label className="form-modality-label">Modalidad del Servicio:</label>
          <div className="form-modality-pills">
            <button
              type="button"
              className={`form-mod-pill ${!isPrivate ? 'active shared' : ''}`}
              onClick={() => onServiceModeChange('shared')}
            >
              <i className="fi fi-sr-users-alt"></i>
              <span>Compartido (Horarios fijos)</span>
            </button>
            <button
              type="button"
              className={`form-mod-pill ${isPrivate ? 'active private' : ''}`}
              onClick={() => onServiceModeChange('private')}
            >
              <i className="fi fi-sr-crown"></i>
              <span>Privado (Horarios a elección)</span>
            </button>
          </div>
        </div>
      )}

      <div className="pm-card-title">
        <div className='title-section'>
          <h2>Tus datos y horarios • {tourTitle}</h2>
          <p>
            {isPrivate
              ? 'Completá la información para tu servicio privado exclusivo'
              : 'Completá la información para tu reserva'}
          </p>
        </div>
      </div>

      <div className="pm-form-grid">
        <div className="pm-input">
          <label>Nombre y apellido</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={passengerName}
            onChange={(e) => onPassengerNameChange && onPassengerNameChange(e.target.value)}
          />
        </div>

        <div className="pm-input">
          <label>Número de celular / WhatsApp</label>
          <input
            type="text"
            placeholder="+54 9 2966 76 4900"
            value={passengerPhone}
            onChange={(e) => onPassengerPhoneChange && onPassengerPhoneChange(e.target.value)}
          />
        </div>

        <div className="pm-input">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@example.com"
            value={passengerEmail}
            onChange={(e) => onPassengerEmailChange && onPassengerEmailChange(e.target.value)}
          />
        </div>

        {/* Custom Calendar Date Picker */}
        <div className="pm-input pm-input-date-container">
          <label className="pm-date-label">
            <span className="pm-date-label-title">
              Fecha de la excursión
            </span>
          </label>
          <CustomCalendar
            value={date}
            onChange={(selectedDate) => onDateChange && onDateChange(selectedDate)}
            placeholder="Seleccionar fecha de la excursión"
            isPrivate={isPrivate}
          />
          <small className="pm-input-hint">Elegí el día deseado para tu traslado o excursión.</small>
        </div>

        {/* Sección de Horarios: Fijos coloreados para Compartido vs Time Pickers para Privado */}
        {hasModalitySwitch && !isPrivate && (
          <div className="pm-input pm-input-full-span">
            <label className="label-with-badge">
              <span>Horario de Salida y Regreso (Fijos)</span>
              <span className="badge-shared-fixed">Horarios fijos garantizados</span>
            </label>
            <div className="pm-shift-selector-grid">
              <button
                type="button"
                className={`pm-shift-btn shift-morning-btn ${selectedShift === '08:00 hs' ? 'selected' : ''}`}
                onClick={() => onShiftChange && onShiftChange('08:00 hs')}
              >
                <div className="shift-btn-radio">
                  <div className="radio-dot"></div>
                </div>
                <div className="shift-btn-content">
                  <div className="shift-btn-header">
                    <i className="fi fi-rr-sun"></i>
                    <strong>Turno Mañana (08:00 hs)</strong>
                  </div>
                  <p>Salida: <strong>08:00 hs</strong> • Regreso aprox: <strong>14:00 hs</strong></p>
                </div>
              </button>

              <button
                type="button"
                className={`pm-shift-btn shift-afternoon-btn ${selectedShift === '14:00 hs' ? 'selected' : ''}`}
                onClick={() => onShiftChange && onShiftChange('14:00 hs')}
              >
                <div className="shift-btn-radio">
                  <div className="radio-dot"></div>
                </div>
                <div className="shift-btn-content">
                  <div className="shift-btn-header">
                    <i className="fi fi-rr-sunset"></i>
                    <strong>Turno Tarde (14:00 hs)</strong>
                  </div>
                  <p>Salida: <strong>14:00 hs</strong> • Regreso aprox: <strong>19:30 hs</strong></p>
                </div>
              </button>
            </div>
          </div>
        )}

        {hasModalitySwitch && isPrivate && (
          <>
            <div className="pm-input">
              <label>
                <i className="fi fi-rr-clock text-gold"></i> Hora de Salida (A tu elección)
              </label>
              <input
                type="time"
                className="pm-time-input"
                value={customDepartureTime}
                onChange={(e) => onCustomDepartureChange && onCustomDepartureChange(e.target.value)}
              />
              <small className="pm-input-hint">El chofer pasará a buscarte por tu hotel a esta hora.</small>
            </div>

            <div className="pm-input">
              <label>
                <i className="fi fi-rr-clock-three text-gold"></i> Hora de Regreso (A convenir)
              </label>
              <input
                type="time"
                className="pm-time-input"
                value={customReturnTime}
                onChange={(e) => onCustomReturnChange && onCustomReturnChange(e.target.value)}
              />
              <small className="pm-input-hint">Podrás coordinar el regreso con el chofer.</small>
            </div>
          </>
        )}

        <div className="pm-input">
          <label>Cantidad de pasajeros</label>
          {isPromo ? (
            <div className="pm-input-promo-fixed">
              <input
                type="text"
                value={`${promoPassengersCount} pasajeros (Promoción fija)`}
                disabled
                readOnly
                className="pm-input-disabled"
              />
              <small className="pm-promo-fixed-notice">
                <i className="fi fi-rr-lock"></i> Capacidad fija según la promoción configurada
              </small>
            </div>
          ) : (
            <>
              <select
                value={passengersCount}
                onChange={(e) => onPassengersCountChange && onPassengersCountChange(Number(e.target.value))}
              >
                <option value={1}>1 pasajero (Tarifa base hasta 4 pax)</option>
                <option value={2}>2 pasajeros (Tarifa base hasta 4 pax)</option>
                <option value={3}>3 pasajeros (Tarifa base hasta 4 pax)</option>
                <option value={4}>4 pasajeros (Tarifa base hasta 4 pax)</option>
                <option value={5}>Más de 4 personas (Consultar cotización grupal)</option>
              </select>
              {passengersCount > 4 && (
                <div className="pm-passenger-consult-alert">
                  <i className="fi fi-rr-info"></i>
                  <div>
                    <strong>Grupos de más de 4 personas</strong>
                    <p>
                      La capacidad estándar es de hasta 4 personas. Para 5 o más pasajeros cotizamos unidades de mayor porte o traslados combinados vía WhatsApp.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="pm-input">
          <label>Punto de encuentro / Hotel / Alojamiento</label>
          <input
            type="text"
            placeholder="Ej: Hotel Posada Los Álamos"
            value={meetingPoint}
            onChange={(e) => onMeetingPointChange && onMeetingPointChange(e.target.value)}
          />
        </div>

        <div className="pm-input">
          <label>Opción de pago</label>
          <select
            value={currentPaymentMethod}
            onChange={(e) => handlePaymentChange(e.target.value)}
          >
            <option value="Efectivo / Cash">Efectivo / Cash</option>
            <option value="Transferencia / virtual">Transferencia / virtual</option>
            <option value="Tarjeta">
              {creditCardSurcharge > 0
                ? `Tarjeta de crédito (+${creditCardSurcharge}%)`
                : 'Tarjeta de crédito'}
            </option>
          </select>
          {creditCardSurcharge > 0 && currentPaymentMethod === 'Tarjeta' && (
            <small className="pm-promo-surcharge-notice">
              <i className="fi fi-rr-percentage"></i> Se aplica un recargo del {creditCardSurcharge}% por pago con tarjeta de crédito
            </small>
          )}
        </div>
      </div>

      <div className={`pm-alert ${isPrivate ? 'alert-gold' : ''}`}>
        {isPrivate ? (
          <>
            <i className="fi fi-sr-crown text-gold"></i>
            <div>
              <strong>Servicio Privado VIP (Hasta 4 personas):</strong> Vehículo y chofer exclusivos. Elegís libremente tus horarios de salida y regreso. Si viajan más de 4 personas, consultanos precio para cotizar unidad adicional.
            </div>
          </>
        ) : (
          <>
            <i className="fi fi-sr-info"></i>
            <div>
              <strong>Servicio Compartido (Hasta 4 personas):</strong> Salidas en horarios fijos programados para garantizar puntualidad. La diferencia con el servicio privado es la elección libre de horario. Si son más de 4 personas, consultanos precio.
            </div>
          </>
        )}
      </div>

      {/* Botones de acción del formulario: Volver a Info y Finalizar */}
      <div className="pm-form-nav-buttons">
        {onBackToInfo && (
          <button
            type="button"
            className="pm-btn-nav-back"
            onClick={onBackToInfo}
          >
            <i className="fi fi-rr-arrow-left"></i>
            <span>Volver a Información</span>
          </button>
        )}

        {onFinalize && (
          <button
            type="button"
            className={`pm-btn-nav-finalize ${isPrivate ? 'btn-finalize-gold' : ''}`}
            onClick={onFinalize}
          >
            <span>Finalizar y Ver Resumen</span>
            <i className="fi fi-rr-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default FormularioReserva;