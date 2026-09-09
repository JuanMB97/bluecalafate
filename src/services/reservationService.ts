import apiClient from '../api/client';
import type {
  CreateReservationDto,
  ReservationItem,
  ReservationResponse,
  ReservationStatus,
  DeleteResponse,
} from '../types';

export const reservationService = {
  /**
   * Envía una nueva reserva a la API backend
   */
  async create(data: CreateReservationDto): Promise<ReservationResponse> {
    const response = await apiClient.post<ReservationResponse>('/reservations', data);
    return response.data;
  },

  /**
   * Obtiene el listado completo de reservas desde la API
   */
  async getAll(status?: string): Promise<ReservationItem[]> {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await apiClient.get<ReservationItem[]>('/reservations', { params });
    return response.data;
  },

  /**
   * Obtiene una reserva por ID desde la API
   */
  async getById(id: string): Promise<ReservationItem> {
    const response = await apiClient.get<ReservationItem>(`/reservations/${id}`);
    return response.data;
  },

  /**
   * Actualiza el estado de una reserva (PENDING, CONFIRMED, CANCELLED) en la API
   */
  async updateStatus(id: string, status: ReservationStatus): Promise<ReservationItem> {
    const response = await apiClient.patch<ReservationItem>(`/reservations/${id}/status`, { status });
    return response.data;
  },

  /**
   * Elimina una reserva en la API
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(`/reservations/${id}`);
    return response.data;
  },
};

export default reservationService;

