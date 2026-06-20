import { api } from './http';
import type { ApiSuccessResponse, CreateRoomPayload, Room, UpdateRoomPayload } from '@/types';

const ROOMS_PATH = '/rooms';

export const roomsService = {
  async create(payload: CreateRoomPayload): Promise<Room> {
    const response = await api.post<ApiSuccessResponse<Room>>(ROOMS_PATH, payload);

    return response.data.data;
  },

  async findById(id: string): Promise<Room> {
    const response = await api.get<ApiSuccessResponse<Room>>(`${ROOMS_PATH}/${id}`);

    return response.data.data;
  },

  async list(): Promise<Room[]> {
    const response = await api.get<ApiSuccessResponse<Room[]>>(ROOMS_PATH);

    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ROOMS_PATH}/${id}`);
  },

  async update(id: string, payload: UpdateRoomPayload): Promise<Room> {
    const response = await api.patch<ApiSuccessResponse<Room>>(`${ROOMS_PATH}/${id}`, payload);

    return response.data.data;
  },
};

