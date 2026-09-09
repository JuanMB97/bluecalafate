import apiClient from '../api/client';
import type { Vehicle, DeleteResponse } from '../types';

export const vehicleService = {
  /**
   * Obtiene la flota completa de vehículos desde la API
   */
  async getAll(): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  /**
   * Obtiene el detalle de un vehículo específico por ID desde la API
   */
  async getById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo vehículo en la API
   */
  async create(data: Vehicle): Promise<Vehicle> {
    const response = await apiClient.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  /**
   * Actualiza un vehículo en la API
   */
  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un vehículo en la API
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/vehicles/${id}`);
    return response.data;
  },
};

export default vehicleService;

