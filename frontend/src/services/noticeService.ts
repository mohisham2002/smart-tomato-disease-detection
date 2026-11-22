import { api } from './userService';
import { NoticeDTO, CreateNoticeRequestDTO, UpdateNoticeRequestDTO } from '../types/notification';

export const noticeService = {
  createNotice: async (data: CreateNoticeRequestDTO): Promise<NoticeDTO> => {
    console.log('Creating notice with data:', data);
    try {
      const response = await api.post<NoticeDTO>('/notices', data);
      console.log('Create notice response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating notice:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllNotices: async (): Promise<NoticeDTO[]> => {
    console.log('Fetching all notices from /api/notices');
    try {
      const response = await api.get<NoticeDTO[]>('/notices');
      console.log('Get all notices response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notices:', error.response?.data || error.message);
      throw error;
    }
  },

  getActiveNotices: async (): Promise<NoticeDTO[]> => {
    const response = await api.get<NoticeDTO[]>('/notices/active');
    return response.data;
  },

  getNoticeById: async (id: number): Promise<NoticeDTO> => {
    const response = await api.get<NoticeDTO>(`/notices/${id}`);
    return response.data;
  },

  updateNotice: async (id: number, data: UpdateNoticeRequestDTO): Promise<NoticeDTO> => {
    const response = await api.put<NoticeDTO>(`/notices/${id}`, data);
    return response.data;
  },

  deleteNotice: async (id: number): Promise<void> => {
    await api.delete(`/notices/${id}`);
  },
};
