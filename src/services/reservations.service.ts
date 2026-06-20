import { api } from './http';
import type {
  ApiSuccessResponse,
  CreateReservationPayload,
  Reservation,
  ReservationListQuery,
  UpdateReservationPayload,
} from '@/types';

const RESERVATIONS_PATH = '/reservations';

export async function listReservations(params?: ReservationListQuery): Promise<Reservation[]> {
  const response = await api.get<ApiSuccessResponse<Reservation[]>>(RESERVATIONS_PATH, {
    params,
  });

  return response.data.data;
}

export async function getReservation(id: string): Promise<Reservation> {
  const response = await api.get<ApiSuccessResponse<Reservation>>(`${RESERVATIONS_PATH}/${id}`);

  return response.data.data;
}

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<Reservation> {
  const response = await api.post<ApiSuccessResponse<Reservation>>(RESERVATIONS_PATH, payload);

  return response.data.data;
}

export async function updateReservation(
  id: string,
  payload: UpdateReservationPayload,
): Promise<Reservation> {
  const response = await api.patch<ApiSuccessResponse<Reservation>>(
    `${RESERVATIONS_PATH}/${id}`,
    payload,
  );

  return response.data.data;
}

export async function deleteReservation(id: string): Promise<void> {
  await api.delete(`${RESERVATIONS_PATH}/${id}`);
}

export const reservationsService = {
  create: createReservation,
  createReservation,
  deleteReservation,
  findById: getReservation,
  getReservation,
  list: listReservations,
  listReservations,
  remove: deleteReservation,
  update: updateReservation,
  updateReservation,
};
