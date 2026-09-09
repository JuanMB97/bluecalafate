import apiClient from '../api/client';
import type { Tour, DeleteResponse } from '../types';

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

  /**
   * Actualiza los datos de un tour en la API
   */
  async update(id: string, data: Partial<Tour>): Promise<Tour> {
    const response = await apiClient.put<Tour>(`/tours/${id}`, data);
    return response.data;
  },

  /**
   * Crea un nuevo tour en la API
   */
  async create(data: Omit<Tour, 'id'>): Promise<Tour> {
    const response = await apiClient.post<Tour>('/tours', data);
    return response.data;
  },

  /**
   * Elimina un tour en la API
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/tours/${id}`);
    return response.data;
  },
};

export default tourService;

