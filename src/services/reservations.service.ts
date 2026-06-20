import { api } from './http';
import type {
  ApiSuccessResponse,
  CreateReservationPayload,
  Reservation,
  ReservationListQuery,
  UpdateReservationPayload,
} from '@/types';

const RESERVATIONS_PATH = '/reservations';

export const reservationsService = {
  async create(payload: CreateReservationPayload): Promise<Reservation> {
    const response = await api.post<ApiSuccessResponse<Reservation>>(RESERVATIONS_PATH, payload);

    return response.data.data;
  },

  async findById(id: string): Promise<Reservation> {
    const response = await api.get<ApiSuccessResponse<Reservation>>(`${RESERVATIONS_PATH}/${id}`);

    return response.data.data;
  },

  async list(params?: ReservationListQuery): Promise<Reservation[]> {
    const response = await api.get<ApiSuccessResponse<Reservation[]>>(RESERVATIONS_PATH, {
      params,
    });

    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${RESERVATIONS_PATH}/${id}`);
  },

  async update(id: string, payload: UpdateReservationPayload): Promise<Reservation> {
    const response = await api.patch<ApiSuccessResponse<Reservation>>(
      `${RESERVATIONS_PATH}/${id}`,
      payload,
    );

    return response.data.data;
  },
};

