import apiClient from '../api/client';
import type { CreateReservationDto, ReservationResponse } from '../types';

export type { CreateReservationDto, ReservationResponse };

export const reservationService = {
  /**
   * Envía una nueva reserva a la API backend
   */
  async create(data: CreateReservationDto): Promise<ReservationResponse> {
    const response = await apiClient.post<ReservationResponse>('/reservations', data);
    return response.data;
  },

  /**
   * Obtiene el listado de reservas desde la API
   */
  async getAll(status?: string): Promise<ReservationResponse[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<ReservationResponse[]>('/reservations', { params });
    return response.data;
  },

  /**
   * Obtiene una reserva por ID desde la API
   */
  async getById(id: string): Promise<ReservationResponse> {
    const response = await apiClient.get<ReservationResponse>(`/reservations/${id}`);
    return response.data;
  },
};

export default reservationService;
