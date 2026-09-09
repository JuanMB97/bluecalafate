export interface Tour {
  id: string;
  slug: string;
  title: string;
  place: string;
  phrase: string;
  image: string; // Portada del tour
  tourCardImg: string; // Miniatura para las tarjetas TourCard
  galleryImages?: string[]; // Array de nombres/URLs de imágenes asociadas (visor futuro)
  departureTime: string;
  returnTime: string;
  pricePerPerson: string;
  priceNumber: number;
  totalExample: string;
  logoIcon: string;
  serviceType: string;
  hasPrivateOption?: boolean;
  privatePricePerPerson?: string;
  privatePriceNumber?: number;
  privateTotalExample?: string;
  privatePhrase?: string;
  sharedDepartureTimes?: string[];
  sharedReturnTimes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TourCardProps {
  id?: string;
  title: string;
  image?: string;
  tourCardImg?: string;
  galleryImages?: string[];
  slug?: string;
  tourimg?: string;
  logo?: string;
  logoIcon?: string;
  linkTour?: string;
  description?: string;
  phrase?: string;
  place?: string;
  departureTime?: string;
  returnTime?: string;
  pricePerPerson?: string;
  priceNumber?: number;
  totalExample?: string;
  serviceType?: string;
  hasPrivateOption?: boolean;
}

export interface TourInfoCardProps {
  tour: Tour;
  serviceMode?: 'shared' | 'private';
  onServiceModeChange?: (mode: 'shared' | 'private') => void;
  onProceedToForm: () => void;
}

export interface ToursContainerProps {
  tours?: Tour[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export interface BannerInfoProps {
  departureTime?: string;
  returnTime?: string;
  scheduleLabel?: string;
  scheduleSublabel?: string;
  serviceMode?: 'shared' | 'private';
  hasModalitySwitch?: boolean;
  onServiceModeChange?: (mode: 'shared' | 'private') => void;
}

export interface PortadaProps {
  place?: string;
  phrase?: string;
  image?: string;
  highlightText?: string;
  serviceType?: string;
  dailyDepartures?: string;
}

export type CreateTourPayload = Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateTourFormData {
  title: string;
  slug: string;
  place: string;
  phrase: string;
  image: string; // Portada
  tourCardImg: string; // Miniatura TourCard
  galleryImages: string[]; // Galería de imágenes
  departureTime: string;
  returnTime: string;
  pricePerPerson: string;
  priceNumber: number;
  totalExample: string;
  logoIcon: string;
  serviceType: string;
  hasPrivateOption: boolean;
  privatePricePerPerson: string;
  privatePriceNumber: number;
  privateTotalExample: string;
  privatePhrase: string;
  sharedDepartureTimes: string;
  sharedReturnTimes: string;
}

export interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTourCreated: (newTour: Tour) => void;
}
