export type AdCategory = 'comida' | 'excursion' | 'bar' | 'tienda_ropa' | 'otro';

export type SocialNetwork = 'instagram' | 'tiktok' | 'facebook';

export interface ISocialMedia {
  network: SocialNetwork;
  handle: string;
}

export interface IAdvertising {
  id: string;
  title: string;
  category: AdCategory;
  image: string;
  location: string;
  slogan: string;
  linkPage?: string;
  socialMedia: ISocialMedia[];
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type Advertising = IAdvertising;

export type CreateAdPayload = Omit<IAdvertising, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAdPayload = Partial<CreateAdPayload>;

export interface CategoryConfig {
  label: string;
  icon: string;
}

export interface AdFormState {
  title: string;
  category: AdCategory;
  image: string;
  location: string;
  slogan: string;
  linkPage: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  isActive: boolean;
}

export interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated?: (newAd: Advertising) => void;
  adToEdit?: Advertising | null;
}

export interface AdBannerProps {
  ad: Advertising;
  className?: string;
}

export interface AdsContainerProps {
  ads?: Advertising[];
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}


