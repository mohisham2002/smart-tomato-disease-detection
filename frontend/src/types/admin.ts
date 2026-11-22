export interface AdminAnalyticsDTO {
  users: UserAnalyticsDTO;
  detections: DetectionAnalyticsDTO;
  feedback: FeedbackAnalyticsDTO;
  images: ImageAnalyticsDTO;
}

export interface UserAnalyticsDTO {
  total: number;
  active: number;
  inactive: number;
  admins: number;
}

export interface DetectionAnalyticsDTO {
  total: number;
  healthy: number;
  diseased: number;
  healthyPercentage: number;
  diseasedPercentage: number;
}

export interface FeedbackAnalyticsDTO {
  total: number;
  pending: number;
  resolved: number;
  spam: number;
}

export interface ImageAnalyticsDTO {
  total: number;
  totalSize: number;
}

export interface SystemSettingsDTO {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequestDTO {
  value: string;
}
