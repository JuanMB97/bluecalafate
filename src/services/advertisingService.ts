import apiClient from '../api/client';
import type {
  Advertising,
  CreateAdPayload,
  UpdateAdPayload,
  DeleteResponse,
  ISocialMedia,
  SocialNetwork,
} from '../types';

function normalizeAd(ad: any): Advertising {
  if (!ad) return ad;
  let socialMedia: ISocialMedia[] = [];

  if (Array.isArray(ad.socialMedia)) {
    socialMedia = ad.socialMedia
      .map((s: any) => {
        if (typeof s === 'string') {
          return { network: 'instagram' as SocialNetwork, handle: s };
        }
        if (s && typeof s === 'object') {
          return {
            network: (s.network || 'instagram') as SocialNetwork,
            handle: typeof s.handle === 'string' ? s.handle : '',
          };
        }
        return null;
      })
      .filter((s: any): s is ISocialMedia => !!s && typeof s.handle === 'string' && s.handle.trim().length > 0);
  } else if (typeof ad.socialMedia === 'string' && ad.socialMedia.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(ad.socialMedia);
      if (Array.isArray(parsed)) {
        socialMedia = parsed
          .map((s: any) => {
            if (typeof s === 'string') {
              return { network: 'instagram' as SocialNetwork, handle: s };
            }
            if (s && typeof s === 'object') {
              return {
                network: (s.network || 'instagram') as SocialNetwork,
                handle: typeof s.handle === 'string' ? s.handle : '',
              };
            }
            return null;
          })
          .filter((s: any): s is ISocialMedia => !!s && typeof s.handle === 'string' && s.handle.trim().length > 0);
      }
    } catch {}
  } else if (ad.instagram && typeof ad.instagram === 'string') {
    socialMedia = [{ network: 'instagram', handle: ad.instagram }];
  }

  return {
    ...ad,
    title: typeof ad.title === 'string' ? ad.title : '',
    category: ad.category || 'otro',
    image: typeof ad.image === 'string' ? ad.image : '',
    location: typeof ad.location === 'string' ? ad.location : '',
    slogan: typeof ad.slogan === 'string' ? ad.slogan : '',
    linkPage: typeof ad.linkPage === 'string' ? ad.linkPage : '',
    socialMedia,
    isActive: typeof ad.isActive === 'boolean' ? ad.isActive : true,
  };
}

export const advertisingService = {
  /**
   * Obtiene todas las publicidades de empresas
   */
  async getAll(): Promise<Advertising[]> {
    const response = await apiClient.get<Advertising[]>('/ads');
    return Array.isArray(response.data) ? response.data.map(normalizeAd) : [];
  },

  /**
   * Obtiene únicamente las publicidades con visibilidad activa
   */
  async getActive(): Promise<Advertising[]> {
    const response = await apiClient.get<Advertising[]>('/ads/active');
    return Array.isArray(response.data) ? response.data.map(normalizeAd) : [];
  },

  /**
   * Obtiene una publicidad por ID
   */
  async getById(id: string): Promise<Advertising> {
    const response = await apiClient.get<Advertising>(`/ads/${id}`);
    return normalizeAd(response.data);
  },

  /**
   * Guarda / Crea una nueva publicidad
   */
  async create(data: CreateAdPayload): Promise<Advertising> {
    const response = await apiClient.post<Advertising>('/ads', data);
    return normalizeAd(response.data);
  },

  /**
   * Actualiza una publicidad existente
   */
  async update(id: string, data: UpdateAdPayload): Promise<Advertising> {
    const response = await apiClient.patch<Advertising>(`/ads/${id}`, data);
    return normalizeAd(response.data);
  },

  /**
   * Conmuta la visibilidad (activa/pausada) de una publicidad
   */
  async toggleActive(id: string): Promise<Advertising> {
    const response = await apiClient.patch<Advertising>(`/ads/${id}/toggle`);
    return normalizeAd(response.data);
  },

  /**
   * Elimina permanentemente una publicidad
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/ads/${id}`);
    return response.data;
  },
};

export default advertisingService;
