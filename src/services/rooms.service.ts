import { api } from './http';
import type { ApiSuccessResponse, CreateRoomPayload, Room, UpdateRoomPayload } from '@/types';

const ROOMS_PATH = '/rooms';

export async function listRooms(): Promise<Room[]> {
  const response = await api.get<ApiSuccessResponse<Room[]>>(ROOMS_PATH);

  return response.data.data;
}

export async function getRoom(id: string): Promise<Room> {
  const response = await api.get<ApiSuccessResponse<Room>>(`${ROOMS_PATH}/${id}`);

  return response.data.data;
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  const response = await api.post<ApiSuccessResponse<Room>>(ROOMS_PATH, payload);

  return response.data.data;
}

export async function updateRoom(id: string, payload: UpdateRoomPayload): Promise<Room> {
  const response = await api.patch<ApiSuccessResponse<Room>>(`${ROOMS_PATH}/${id}`, payload);

  return response.data.data;
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`${ROOMS_PATH}/${id}`);
}

export const roomsService = {
  create: createRoom,
  createRoom,
  deleteRoom,
  findById: getRoom,
  getRoom,
  list: listRooms,
  listRooms,
  remove: deleteRoom,
  update: updateRoom,
  updateRoom,
};
