import { api } from './userService';
import { LeafImageDTO } from '../types/leafImage';

export const leafImageService = {
  createLeafImage: async (data: { imageName: string; imageData: string; contentType?: string; fileSize?: number; description?: string }): Promise<LeafImageDTO> => {
    const response = await api.post<LeafImageDTO>('/images', data);
    return response.data;
  },

  getAllImages: async (): Promise<LeafImageDTO[]> => {
    const response = await api.get<LeafImageDTO[]>('/images');
    return response.data;
  },

  getMyImages: async (): Promise<LeafImageDTO[]> => {
    const response = await api.get<LeafImageDTO[]>('/images/my');
    return response.data;
  },

  getImageById: async (id: number): Promise<LeafImageDTO> => {
    const response = await api.get<LeafImageDTO>(`/images/${id}`);
    return response.data;
  },

  getUserImages: async (userId: number): Promise<LeafImageDTO[]> => {
    const response = await api.get<LeafImageDTO[]>(`/images/user/${userId}`);
    return response.data;
  },

  searchImages: async (name: string): Promise<LeafImageDTO[]> => {
    const response = await api.get<LeafImageDTO[]>(`/images/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  updateImage: async (id: number, data: { description?: string }): Promise<LeafImageDTO> => {
    const response = await api.put<LeafImageDTO>(`/images/${id}`, data);
    return response.data;
  },

  deleteImage: async (id: number): Promise<void> => {
    await api.delete(`/images/${id}`);
  },

  deleteAllMyImages: async (): Promise<void> => {
    await api.delete('/images/my');
  },

  getTotalCount: async (): Promise<number> => {
    const response = await api.get<number>('/images/stats/count');
    return response.data;
  },
};
