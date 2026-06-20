import { api, unwrapApiData } from './http';
import type {
  ApiSuccessResponse,
  CreateReservationPayload,
  Reservation,
  ReservationListQuery,
  UpdateReservationPayload,
} from '@/types';

const RESERVATIONS_PATH = '/reservations';

export async function listReservations(params?: ReservationListQuery): Promise<Reservation[]> {
  const response = await api.get<ApiSuccessResponse<Reservation[]> | Reservation[]>(RESERVATIONS_PATH, {
    params,
  });
  const reservations = unwrapApiData<Reservation[]>(response.data);

  return Array.isArray(reservations) ? reservations : [];
}

export async function getReservation(id: string): Promise<Reservation> {
  const response = await api.get<ApiSuccessResponse<Reservation> | Reservation>(
    `${RESERVATIONS_PATH}/${id}`,
  );

  return unwrapApiData<Reservation>(response.data);
}

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<Reservation> {
  const response = await api.post<ApiSuccessResponse<Reservation> | Reservation>(
    RESERVATIONS_PATH,
    payload,
  );

  return unwrapApiData<Reservation>(response.data);
}

export async function updateReservation(
  id: string,
  payload: UpdateReservationPayload,
): Promise<Reservation> {
  const response = await api.patch<ApiSuccessResponse<Reservation> | Reservation>(
    `${RESERVATIONS_PATH}/${id}`,
    payload,
  );

  return unwrapApiData<Reservation>(response.data);
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
