import apiClient from '../api/client';
import type { Tour } from '../types';

export const tourService = {
  /**
   * Obtiene la lista completa de tours y traslados desde la API
   */
  async getAll(): Promise<Tour[]> {
    const response = await apiClient.get<Tour[]>('/tours');
    return response.data;
  },

  /**
   * Obtiene un tour específico por su slug o ID desde la API
   */
  async getBySlug(slug: string): Promise<Tour> {
    const response = await apiClient.get<Tour>(`/tours/${slug}`);
    return response.data;
  },
};

export default tourService;
