import apiClient from '../api/client';
import type { TourAvailability, DeleteResponse } from '../types';

export const availabilityService = {
  /**
   * Obtiene la disponibilidad de todos los tours desde la API
   */
  async getAll(): Promise<TourAvailability[]> {
    try {
      const response = await apiClient.get<TourAvailability[]>('/availability');
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Actualiza o crea un registro de disponibilidad para un tour y fecha en la API
   */
  async upsert(slot: Partial<TourAvailability> & { tourId: string; date: string }): Promise<TourAvailability> {
    const response = await apiClient.put<TourAvailability>('/availability', slot);
    return response.data;
  },

  /**
   * Bloquea o desbloquea una fecha para un tour en la API
   */
  async toggleBlock(tourId: string, date: string, isBlocked: boolean): Promise<TourAvailability> {
    return this.upsert({ tourId, date, isBlocked });
  },

  /**
   * Elimina un bloqueo o ajuste específico en la API
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/availability/${id}`);
    return response.data;
  },
};

export default availabilityService;

