export interface FeedbackDTO {
  id: number;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequestDTO {
  subject: string;
  message: string;
}

export interface UpdateFeedbackRequestDTO {
  subject?: string;
  message?: string;
}

export interface UpdateFeedbackStatusRequestDTO {
  status: string;
}
