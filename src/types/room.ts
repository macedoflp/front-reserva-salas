export interface Room {
  capacity: number;
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
}

export interface CreateRoomPayload {
  capacity: number;
  name: string;
}

export type UpdateRoomPayload = Partial<CreateRoomPayload>;

