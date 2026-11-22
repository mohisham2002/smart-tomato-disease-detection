import { api } from './userService';
import { AdminAnalyticsDTO, SystemSettingsDTO, UpdateSettingsRequestDTO } from '../types/admin';

export const adminService = {
  getAnalytics: async (): Promise<AdminAnalyticsDTO> => {
    const response = await api.get<AdminAnalyticsDTO>('/admin/analytics');
    return response.data;
  },

  getUserAnalytics: async (): Promise<AdminAnalyticsDTO['users']> => {
    const response = await api.get<AdminAnalyticsDTO['users']>('/admin/analytics/users');
    return response.data;
  },

  getDetectionAnalytics: async (): Promise<AdminAnalyticsDTO['detections']> => {
    const response = await api.get<AdminAnalyticsDTO['detections']>('/admin/analytics/detections');
    return response.data;
  },

  getFeedbackAnalytics: async (): Promise<AdminAnalyticsDTO['feedback']> => {
    const response = await api.get<AdminAnalyticsDTO['feedback']>('/admin/analytics/feedback');
    return response.data;
  },

  getAllSettings: async (): Promise<SystemSettingsDTO[]> => {
    const response = await api.get<SystemSettingsDTO[]>('/admin/settings');
    return response.data;
  },

  getSettingByKey: async (key: string): Promise<SystemSettingsDTO> => {
    const response = await api.get<SystemSettingsDTO>(`/admin/settings/${key}`);
    return response.data;
  },

  updateSetting: async (key: string, data: UpdateSettingsRequestDTO): Promise<SystemSettingsDTO> => {
    const response = await api.put<SystemSettingsDTO>(`/admin/settings/${key}`, data);
    return response.data;
  },

  createSetting: async (key: string, data: UpdateSettingsRequestDTO, description?: string): Promise<SystemSettingsDTO> => {
    const response = await api.post<SystemSettingsDTO>(`/admin/settings/${key}?${description ? `description=${encodeURIComponent(description)}` : ''}`, data);
    return response.data;
  },

  cleanupInactiveUsers: async (): Promise<void> => {
    await api.delete('/admin/cleanup/inactive');
  },
};
