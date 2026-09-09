import apiClient from '../api/client';
import type { Promotion, PromotionSettings, DeleteResponse } from '../types';

export const DEFAULT_PROMO_SETTINGS: PromotionSettings = {
  homeModalActive: false,
  tourLimitAlertActive: false,
  promoTitle: 'Super Promo 4 Personas',
  promoSubtitle: 'Paquete Completo: Aeropuerto IN/OUT + Glaciar Perito Moreno + El Chaltén Día Completo para hasta 4 personas.',
  promoBadgeText: 'PROMOCIÓN LIMITADA',
  promoWhatsAppNumber: '5492966764900',
  promoWhatsAppText: '¡Hola Blue Calafate! Quiero consultar por la promoción.',
  discountPercentage: 20,
  promoPriceText: 'ARS $180.000',
  promoPassengersCount: 4,
  promoPriceNumber: 180000,
  promoCreditCardSurcharge: 15,
};

export const promotionService = {
  /**
   * Obtiene todas las promociones desde la API
   */
  async getAll(): Promise<Promotion[]> {
    const response = await apiClient.get<Promotion[]>('/promotions');
    return response.data;
  },

  /**
   * Obtiene únicamente las promociones marcadas como activas desde la API
   */
  async getActive(): Promise<Promotion[]> {
    const response = await apiClient.get<Promotion[]>('/promotions/active');
    return response.data;
  },

  /**
   * Obtiene una promoción por ID o slug desde la API
   */
  async getById(idOrSlug: string): Promise<Promotion> {
    const response = await apiClient.get<Promotion>(`/promotions/${idOrSlug}`);
    return response.data;
  },

  /**
   * Crea una nueva promoción en la API
   */
  async create(data: Omit<Promotion, 'id'>): Promise<Promotion> {
    const response = await apiClient.post<Promotion>('/promotions', data);
    return response.data;
  },

  /**
   * Actualiza una promoción existente en la API
   */
  async update(idOrSlug: string, data: Partial<Promotion>): Promise<Promotion> {
    const response = await apiClient.patch<Promotion>(`/promotions/${idOrSlug}`, data);
    return response.data;
  },

  /**
   * Invierte el estado activo/inactivo de una promoción en la API
   */
  async toggleActive(idOrSlug: string): Promise<Promotion> {
    const response = await apiClient.patch<Promotion>(`/promotions/${idOrSlug}/toggle`);
    return response.data;
  },

  /**
   * Elimina permanentemente una promoción en la API
   */
  async delete(idOrSlug: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/promotions/${idOrSlug}`);
    return response.data;
  },

  /**
   * Retorna la configuración de la promoción activa principal
   */
  async getSettings(): Promise<PromotionSettings> {
    try {
      const promos = await this.getAll();
      const active = promos.find((p) => p.isActive);
      if (active) {
        return {
          homeModalActive: Boolean(active.isActive && (active.showHomeModal ?? true)),
          tourLimitAlertActive: Boolean(active.isActive && (active.showTourLimitAlert ?? true)),
          promoTitle: active.title,
          promoSubtitle: active.subtitle,
          promoBadgeText: active.badgeText || 'PROMOCIÓN LIMITADA',
          promoWhatsAppNumber: active.whatsappNumber || '5492966764900',
          promoWhatsAppText: active.whatsappText || '¡Hola Blue Calafate!',
          discountPercentage: 20,
          promoPriceText: active.priceText || `ARS $${active.priceNumber.toLocaleString('es-AR')}`,
          promoPassengersCount: active.passengersCount,
          promoPriceNumber: active.priceNumber,
          promoCreditCardSurcharge: active.creditCardSurcharge,
        };
      }
    } catch {
      // Fallback a configuración por defecto si la API aún no respondió
    }
    return DEFAULT_PROMO_SETTINGS;
  },

  /**
   * Actualiza la promoción activa principal
   */
  async updateSettings(data: Partial<PromotionSettings>): Promise<PromotionSettings> {
    const promos = await this.getAll();
    const active = promos.find((p) => p.isActive) || promos[0];
    if (active) {
      await this.update(active.id, {
        title: data.promoTitle ?? active.title,
        subtitle: data.promoSubtitle ?? active.subtitle,
        badgeText: data.promoBadgeText ?? active.badgeText,
        priceNumber: data.promoPriceNumber ?? active.priceNumber,
        priceText: data.promoPriceText ?? active.priceText,
        creditCardSurcharge: data.promoCreditCardSurcharge ?? active.creditCardSurcharge,
        passengersCount: data.promoPassengersCount ?? active.passengersCount,
        showHomeModal: data.homeModalActive ?? active.showHomeModal,
        showTourLimitAlert: data.tourLimitAlertActive ?? active.showTourLimitAlert,
        whatsappNumber: data.promoWhatsAppNumber ?? active.whatsappNumber,
        whatsappText: data.promoWhatsAppText ?? active.whatsappText,
      });
      return this.getSettings();
    }
    return DEFAULT_PROMO_SETTINGS;
  },
};

export default promotionService;

