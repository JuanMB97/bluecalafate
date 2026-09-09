import type { Vehicle } from './vehicle.types';
import type { Tour } from './tour.types';

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  image: string;
  priceNumber: number;
  priceText?: string;
  creditCardSurcharge: number;
  vehicleId?: string;
  passengersCount: number;
  includedTourIds?: string[];
  isActive: boolean;
  showHomeModal?: boolean;
  showTourLimitAlert?: boolean;
  whatsappNumber?: string;
  whatsappText?: string;
  includes?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PromotionSettings {
  homeModalActive: boolean;
  tourLimitAlertActive: boolean;
  promoTitle: string;
  promoSubtitle: string;
  promoBadgeText: string;
  promoWhatsAppNumber: string;
  promoWhatsAppText: string;
  discountPercentage?: number;
  promoPriceText?: string;
  promoPassengersCount?: number;
  promoPriceNumber?: number;
  promoCreditCardSurcharge?: number;
}

export interface PromoCardsContainerProps {
  promos?: Promotion[];
  title?: string;
  subtitle?: string;
}

export interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromoSaved: () => void;
  promoToEdit?: Promotion | null;
  vehicles?: Vehicle[];
  tours?: Tour[];
}
