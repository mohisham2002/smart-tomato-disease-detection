export interface NotificationDTO {
  id: number;
  userId: number;
  userName: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isBroadcast: boolean;
  broadcastId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequestDTO {
  title: string;
  message: string;
  type?: string;
  target?: string;
}

export interface UpdateNotificationRequestDTO {
  title?: string;
  message?: string;
  type?: string;
}

export interface NoticeDTO {
  id: number;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeRequestDTO {
  title: string;
  message: string;
  type: string;
}

export interface UpdateNoticeRequestDTO {
  title?: string;
  message?: string;
  type?: string;
}
