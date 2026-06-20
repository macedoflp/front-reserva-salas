import type { Room } from './room';

export type ReservationStatus = 'finished' | 'ongoing' | 'upcoming';
export type ReservationOrder = 'asc' | 'desc';

export interface Reservation {
  createdAt: string;
  endsAt: string;
  id: string;
  participants: number;
  room?: Room | null;
  roomId: string;
  startsAt: string;
  status: ReservationStatus;
  title: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  endsAt: string;
  participants: number;
  roomId: string;
  startsAt: string;
  title: string;
}

export type UpdateReservationPayload = Partial<CreateReservationPayload>;

export interface ReservationListQuery {
  order?: ReservationOrder;
  roomId?: string;
  status?: ReservationStatus;
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  finished: 'Encerrada',
  ongoing: 'Em andamento',
  upcoming: 'Próxima',
};
