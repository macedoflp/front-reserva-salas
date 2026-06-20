import { api, unwrapApiData } from './http';
import type { ApiSuccessResponse, CreateRoomPayload, Room, UpdateRoomPayload } from '@/types';

const ROOMS_PATH = '/rooms';

export async function listRooms(): Promise<Room[]> {
  const response = await api.get<ApiSuccessResponse<Room[]> | Room[]>(ROOMS_PATH);
  const rooms = unwrapApiData<Room[]>(response.data);

  return Array.isArray(rooms) ? rooms : [];
}

export async function getRoom(id: string): Promise<Room> {
  const response = await api.get<ApiSuccessResponse<Room> | Room>(`${ROOMS_PATH}/${id}`);

  return unwrapApiData<Room>(response.data);
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  const response = await api.post<ApiSuccessResponse<Room> | Room>(ROOMS_PATH, payload);

  return unwrapApiData<Room>(response.data);
}

export async function updateRoom(id: string, payload: UpdateRoomPayload): Promise<Room> {
  const response = await api.patch<ApiSuccessResponse<Room> | Room>(`${ROOMS_PATH}/${id}`, payload);

  return unwrapApiData<Room>(response.data);
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
