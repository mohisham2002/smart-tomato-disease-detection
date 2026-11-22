import { api } from './userService';
import { NotificationDTO, CreateNotificationRequestDTO, UpdateNotificationRequestDTO } from '../types/notification';

export const notificationService = {
  createNotification: async (data: CreateNotificationRequestDTO): Promise<NotificationDTO> => {
    console.log('Creating notification with data:', data);
    try {
      const response = await api.post<NotificationDTO>('/notifications', data);
      console.log('Create notification response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating notification:', error.response?.data || error.message);
      throw error;
    }
  },

  createNotificationForUser: async (userId: number, data: CreateNotificationRequestDTO): Promise<NotificationDTO> => {
    const response = await api.post<NotificationDTO>(`/notifications/user/${userId}`, data);
    return response.data;
  },

  getAllNotifications: async (): Promise<NotificationDTO[]> => {
    console.log('Fetching all notifications from /api/notifications');
    try {
      const response = await api.get<NotificationDTO[]>('/notifications');
      console.log('Get all notifications response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await api.get<NotificationDTO[]>('/notifications/my');
    return response.data;
  },

  getUnreadNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await api.get<NotificationDTO[]>('/notifications/unread');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<number>('/notifications/count');
    return response.data;
  },

  getNotificationById: async (id: number): Promise<NotificationDTO> => {
    const response = await api.get<NotificationDTO>(`/notifications/${id}`);
    return response.data;
  },

  getUserNotifications: async (userId: number): Promise<NotificationDTO[]> => {
    const response = await api.get<NotificationDTO[]>(`/notifications/user/${userId}`);
    return response.data;
  },

  updateNotification: async (id: number, data: UpdateNotificationRequestDTO): Promise<NotificationDTO> => {
    const response = await api.put<NotificationDTO>(`/notifications/${id}`, data);
    return response.data;
  },

  markAsRead: async (id: number): Promise<NotificationDTO> => {
    const response = await api.put<NotificationDTO>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  deleteBroadcastNotification: async (id: number): Promise<void> => {
    await api.delete(`/notifications/broadcast/${id}`);
  },

  deleteAllMyNotifications: async (): Promise<void> => {
    await api.delete('/notifications/my');
  },
};
