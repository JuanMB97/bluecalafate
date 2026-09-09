export interface TourAvailability {
  id: string;
  tourId: string;
  date: string; // YYYY-MM-DD
  maxSeats: number;
  reservedSeats: number;
  isBlocked: boolean;
  notes?: string;
}

export interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  activeTours: number;
  promosActiveCount: number;
  estimatedRevenue: number;
}

export type TabType = 'overview' | 'tours' | 'promos' | 'ads' | 'reservations' | 'availability';

export interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact';
}

export interface SocialMediaProps {
  showTitle?: boolean;
}

export interface TicketParqueProps {
  className?: string;
}

export interface CustomCalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  isPrivate?: boolean;
  disabled?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}


