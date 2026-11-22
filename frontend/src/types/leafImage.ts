export interface LeafImageDTO {
  id: number;
  userId: number;
  userName: string;
  imageName: string;
  imageData: string;
  contentType: string;
  fileSize: number;
  description: string | null;
  uploadedAt: string;
  updatedAt: string;
}

export interface CreateLeafImageRequestDTO {
  imageName: string;
  imageData: string;
  contentType?: string;
  fileSize?: number;
  description?: string;
}

export interface UpdateLeafImageRequestDTO {
  description?: string;
}
