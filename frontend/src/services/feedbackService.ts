import { api } from './userService';
import { FeedbackDTO, CreateFeedbackRequestDTO, UpdateFeedbackRequestDTO, UpdateFeedbackStatusRequestDTO } from '../types/feedback';

export const feedbackService = {
  createFeedback: async (data: CreateFeedbackRequestDTO): Promise<FeedbackDTO> => {
    const response = await api.post<FeedbackDTO>('/feedback', data);
    return response.data;
  },

  getAllFeedback: async (): Promise<FeedbackDTO[]> => {
    const response = await api.get<FeedbackDTO[]>('/feedback');
    return response.data;
  },

  getMyFeedback: async (): Promise<FeedbackDTO[]> => {
    const response = await api.get<FeedbackDTO[]>('/feedback/my');
    return response.data;
  },

  getFeedbackById: async (id: number): Promise<FeedbackDTO> => {
    const response = await api.get<FeedbackDTO>(`/feedback/${id}`);
    return response.data;
  },

  getFeedbackByStatus: async (status: string): Promise<FeedbackDTO[]> => {
    const response = await api.get<FeedbackDTO[]>(`/feedback/status/${status}`);
    return response.data;
  },

  updateFeedback: async (id: number, data: UpdateFeedbackRequestDTO): Promise<FeedbackDTO> => {
    const response = await api.put<FeedbackDTO>(`/feedback/${id}`, data);
    return response.data;
  },

  updateFeedbackStatus: async (id: number, data: UpdateFeedbackStatusRequestDTO): Promise<FeedbackDTO> => {
    const response = await api.put<FeedbackDTO>(`/feedback/${id}/status`, data);
    return response.data;
  },

  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};
