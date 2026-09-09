import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CustomCalendarProps } from '../../types';
import './custom_calendar.css';

// Helpers para formato de fechas en zona horaria local
const getLocalDateString = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
};

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value = '',
  onChange,
  minDate,
  maxDate,
  placeholder = 'Seleccionar fecha del tour',
  isPrivate = false,
  disabled = false,
}) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const todayStr = getLocalDateString(new Date());
  const effectiveMinDate = minDate || todayStr;

  // Estado de apertura del dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Fecha visible en la navegación del calendario (mes y año)
  const initialDate = parseLocalDate(value) || parseLocalDate(effectiveMinDate) || new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth()); // 0 - 11

  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar mes visible si cambia el valor seleccionado externamente
  useEffect(() => {
    if (value) {
      const parsed = parseLocalDate(value);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [value]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Nombres de meses y días según idioma
  const monthNamesEs = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNames = isEn ? monthNamesEn : monthNamesEs;

  const dayHeadersEs = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayHeadersEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayHeaders = isEn ? dayHeadersEn : dayHeadersEs;

  // Navegación de meses
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Validar si el mes anterior está totalmente en el pasado respecto a effectiveMinDate
  const isPrevMonthDisabled = () => {
    if (!effectiveMinDate) return false;
    const minD = parseLocalDate(effectiveMinDate);
    if (!minD) return false;
    const currentMonthFirst = new Date(viewYear, viewMonth, 1);
    const minMonthFirst = new Date(minD.getFullYear(), minD.getMonth(), 1);
    return currentMonthFirst <= minMonthFirst;
  };

  // Formato visual amigable de la fecha seleccionada
  const getFormattedSelectedDate = (): string => {
    if (!value) return '';
    const parsed = parseLocalDate(value);
    if (!parsed) return value;

    const day = parsed.getDate();
    const month = monthNames[parsed.getMonth()];
    const year = parsed.getFullYear();

    const weekdayEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const weekdayEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = isEn ? weekdayEn[parsed.getDay()] : weekdayEs[parsed.getDay()];

    if (isEn) {
      return `${weekday}, ${month} ${day}, ${year}`;
    }
    return `${weekday}, ${day} de ${month} de ${year}`;
  };

  // Construcción de la matriz de días para el mes visible
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Domingo
  // Ajustar para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
  const startingOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Días del mes anterior para rellenar
  const prevMonthTotalDays = new Date(viewYear, viewMonth, 0).getDate();
  const prevMonthDays: number[] = [];
  for (let i = startingOffset - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthTotalDays - i);
  }

  // Días del mes actual
  const currentDays: number[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentDays.push(i);
  }

  // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
  const totalCells = startingOffset + daysInMonth;
  const nextMonthPaddingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays: number[] = [];
  for (let i = 1; i <= nextMonthPaddingCount; i++) {
    nextMonthDays.push(i);
  }

  // Manejo de clic en un día
  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    const dateStr = getLocalDateString(selectedDate);

    // Validación de fecha mínima (evitar pasado)
    if (effectiveMinDate && dateStr < effectiveMinDate) {
      return;
    }
    // Validación de fecha máxima si existe
    if (maxDate && dateStr > maxDate) {
      return;
    }

    if (onChange) {
      onChange(dateStr);
    }
    setIsOpen(false);
  };

  // Atajos rápidos
  const handleQuickSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(todayStr);
    }
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleQuickSelectTomorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getLocalDateString(tomorrow);
    if (onChange) {
      onChange(tomorrowStr);
    }
    setViewYear(tomorrow.getFullYear());
    setViewMonth(tomorrow.getMonth());
    setIsOpen(false);
  };

  return (
    <div
      className={`custom-calendar-container ${isPrivate ? 'theme-gold' : 'theme-blue'} ${
        disabled ? 'is-disabled' : ''
      }`}
      ref={containerRef}
    >
      {/* Botón Trigger / Input interactivo */}
      <button
        type="button"
        className={`custom-calendar-trigger ${isOpen ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Abrir selector de fecha"
        aria-expanded={isOpen}
      >
        <div className="calendar-trigger-content">
          <div className="calendar-trigger-icon">
            <i className="fi fi-rr-calendar"></i>
          </div>

          <div className="calendar-trigger-texts">
            {value ? (
              <span className="calendar-trigger-selected">{getFormattedSelectedDate()}</span>
            ) : (
              <span className="calendar-trigger-placeholder">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <div className="calendar-trigger-chevron">
          <i className={`fi fi-rr-angle-small-${isOpen ? 'up' : 'down'}`}></i>
        </div>
      </button>

      {/* Dropdown / Popover del Calendario */}
      {isOpen && (
        <div className="custom-calendar-popover">
          {/* Barra de atajos rápidos */}
          <div className="calendar-quick-bar">
            <button
              type="button"
              className="calendar-quick-btn"
              onClick={handleQuickSelectToday}
            >
              <i className="fi fi-rr-sparkles"></i>
              <span>{isEn ? 'Today' : 'Hoy'}</span>
            </button>
            <button
              type="button"
              className="calendar-quick-btn"
              onClick={handleQuickSelectTomorrow}
            >
              <i className="fi fi-rr-forward"></i>
              <span>{isEn ? 'Tomorrow' : 'Mañana'}</span>
            </button>
          </div>

          {/* Navegación de Mes y Año */}
          <div className="calendar-nav-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              disabled={isPrevMonthDisabled()}
              title={isEn ? 'Previous month' : 'Mes anterior'}
            >
              <i className="fi fi-rr-angle-left"></i>
            </button>

            <div className="calendar-current-month">
              <strong>{monthNames[viewMonth]}</strong>
              <span>{viewYear}</span>
            </div>

            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              title={isEn ? 'Next month' : 'Mes siguiente'}
            >
              <i className="fi fi-rr-angle-right"></i>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="calendar-weekdays-grid">
            {dayHeaders.map((dh, idx) => (
              <div key={idx} className="calendar-weekday-cell">
                {dh}
              </div>
            ))}
          </div>

          {/* Matriz de Días */}
          <div className="calendar-days-grid">
            {/* Días del mes anterior (deshabilitados) */}
            {prevMonthDays.map((d, idx) => (
              <div key={`prev-${idx}`} className="calendar-day-cell is-outside-month">
                <span>{d}</span>
              </div>
            ))}

            {/* Días del mes actual */}
            {currentDays.map((d) => {
              const currentCellDate = new Date(viewYear, viewMonth, d);
              const dateStr = getLocalDateString(currentCellDate);

              const isPast = effectiveMinDate ? dateStr < effectiveMinDate : false;
              const isFutureBlocked = maxDate ? dateStr > maxDate : false;
              const isDateDisabled = isPast || isFutureBlocked;

              const isSelected = value === dateStr;
              const isToday = todayStr === dateStr;

              let cellClasses = 'calendar-day-cell';
              if (isDateDisabled) cellClasses += ' is-disabled';
              if (isSelected) cellClasses += ' is-selected';
              if (isToday) cellClasses += ' is-today';

              return (
                <button
                  type="button"
                  key={`cur-${d}`}
                  className={cellClasses}
                  disabled={isDateDisabled}
                  onClick={() => handleSelectDay(d)}
                  title={
                    isDateDisabled
                      ? isEn
                        ? 'Past date unavailable'
                        : 'Fecha no disponible'
                      : dateStr
                  }
                >
                  <span className="day-number">{d}</span>
                  {isToday && !isSelected && <span className="today-dot" />}
                </button>
              );
            })}

            {/* Días del mes siguiente (deshabilitados) */}
            {nextMonthDays.map((d, idx) => (
              <div key={`next-${idx}`} className="calendar-day-cell is-outside-month">
                <span>{d}</span>
              </div>
            ))}
          </div>

          {/* Footer Informativo */}
          <div className="calendar-popover-footer">
            <div className="calendar-footer-badge">
              <i className="fi fi-rr-shield-check"></i>
              <span>
                {isEn ? 'Daily departures guaranteed' : 'Salidas diarias garantizadas'}
              </span>
            </div>
            <span className="calendar-footer-hint">
              {isEn ? 'Select your date' : 'Elegí tu fecha'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
