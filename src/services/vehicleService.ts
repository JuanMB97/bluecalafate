import apiClient from '../api/client';
import type { Vehicle } from '../types';

export const vehicleService = {
  /**
   * Obtiene la flota completa de vehículos desde la API
   */
  async getAll(): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  /**
   * Obtiene el detalle de un vehículo específico por ID
   */
  async getById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },
};

export default vehicleService;
