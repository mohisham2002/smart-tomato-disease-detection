export interface DetectionHistoryDTO {
  id: number;
  userId: number;
  userName: string;
  imageName: string;
  imageData: string;
  diseaseName: string;
  confidence: number;
  result: string;
  notes: string | null;
  tags: string | null;
  detectedAt: string;
  updatedAt: string;
}

export interface CreateDetectionRequestDTO {
  imageName: string;
  imageData: string;
  diseaseName: string;
  confidence: number;
  result: string;
}

export interface UpdateDetectionRequestDTO {
  notes?: string;
  tags?: string;
}
