export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface CreateReservationDto {
  tourId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  date: string;
  passengersCount: number;
  meetingPoint: string;
  paymentMethod: string;
}

export interface ReservationItem {
  id: string;
  tourId: string;
  tourTitle?: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  date: string;
  passengersCount: number;
  meetingPoint: string;
  paymentMethod: string;
  status: ReservationStatus;
  totalPrice?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ReservationResponse {
  id: string;
  status: string;
  createdAt: string;
  message?: string;
  reservation?: ReservationItem;
}

export interface FormularioReservaProps {
  tourTitle?: string;
  serviceMode?: 'shared' | 'private';
  hasModalitySwitch?: boolean;
  onServiceModeChange?: (mode: 'shared' | 'private') => void;
  departureTime?: string;
  returnTime?: string;
  selectedShift?: '08:00 hs' | '14:00 hs';
  onShiftChange?: (shift: '08:00 hs' | '14:00 hs') => void;
  customDepartureTime?: string;
  onCustomDepartureChange?: (time: string) => void;
  customReturnTime?: string;
  onCustomReturnChange?: (time: string) => void;
  passengers?: string;
  passengersCount?: number;
  onPassengersCountChange?: (count: number) => void;
  date?: string;
  onDateChange?: (date: string) => void;
  passengerName?: string;
  onPassengerNameChange?: (name: string) => void;
  passengerPhone?: string;
  onPassengerPhoneChange?: (phone: string) => void;
  passengerEmail?: string;
  onPassengerEmailChange?: (email: string) => void;
  meetingPoint?: string;
  onMeetingPointChange?: (point: string) => void;
  isPromo?: boolean;
  promoPassengersCount?: number;
  selectedPaymentMethod?: string;
  onPaymentMethodChange?: (method: string) => void;
  creditCardSurcharge?: number;
  calculatedTotal?: string;
  onFinalize?: () => void;
  onBackToInfo?: () => void;
}

export interface ResumenReservaProps {
  tourTitle?: string;
  serviceMode?: 'shared' | 'private';
  departureTime?: string;
  returnTime?: string;
  pricePerPerson?: string;
  totalAmount?: string;
  image?: string;
  date?: string;
  passengersCount?: number;
  passengerName?: string;
  meetingPoint?: string;
  paymentMethod?: string;
  whatsappNumber?: string;
  onBackToForm?: () => void;
  onBackToInfo?: () => void;
}
