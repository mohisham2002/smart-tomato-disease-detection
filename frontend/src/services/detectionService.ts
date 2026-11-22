import { api } from './userService';
import { DetectionHistoryDTO } from '../types/detection';

export const detectionService = {
  createDetection: async (data: { imageName: string; imageData: string; diseaseName: string; confidence: number; result: string }): Promise<DetectionHistoryDTO> => {
    const response = await api.post<DetectionHistoryDTO>('/detections', data);
    return response.data;
  },

  getAllDetections: async (): Promise<DetectionHistoryDTO[]> => {
    const response = await api.get<DetectionHistoryDTO[]>('/detections');
    return response.data;
  },

  getMyDetections: async (): Promise<DetectionHistoryDTO[]> => {
    const response = await api.get<DetectionHistoryDTO[]>('/detections/my');
    return response.data;
  },

  getDetectionById: async (id: number): Promise<DetectionHistoryDTO> => {
    const response = await api.get<DetectionHistoryDTO>(`/detections/${id}`);
    return response.data;
  },

  getUserDetections: async (userId: number): Promise<DetectionHistoryDTO[]> => {
    const response = await api.get<DetectionHistoryDTO[]>(`/detections/user/${userId}`);
    return response.data;
  },

  getDetectionsByDisease: async (diseaseName: string): Promise<DetectionHistoryDTO[]> => {
    const response = await api.get<DetectionHistoryDTO[]>(`/detections/disease/${diseaseName}`);
    return response.data;
  },

  getDetectionsByResult: async (result: string): Promise<DetectionHistoryDTO[]> => {
    const response = await api.get<DetectionHistoryDTO[]>(`/detections/result/${result}`);
    return response.data;
  },

  updateDetection: async (id: number, data: { notes?: string; tags?: string }): Promise<DetectionHistoryDTO> => {
    const response = await api.put<DetectionHistoryDTO>(`/detections/${id}`, data);
    return response.data;
  },

  deleteDetection: async (id: number): Promise<void> => {
    await api.delete(`/detections/${id}`);
  },

  deleteAllMyDetections: async (): Promise<void> => {
    await api.delete('/detections/my');
  },

  getTotalCount: async (): Promise<number> => {
    const response = await api.get<number>('/detections/stats/count');
    return response.data;
  },

  getHealthyCount: async (): Promise<number> => {
    const response = await api.get<number>('/detections/stats/healthy');
    return response.data;
  },

  getDiseasedCount: async (): Promise<number> => {
    const response = await api.get<number>('/detections/stats/diseased');
    return response.data;
  },
};
