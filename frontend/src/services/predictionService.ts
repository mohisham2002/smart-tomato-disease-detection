import { api } from './userService';

export interface PredictionResponse {
  diseaseName: string;
  displayName: string;
  confidence: number;
  result: string; // "Diseased" or "Healthy"
}

export const predictionService = {
  /**
   * Send image for prediction
   * @param imageData Base64 encoded image data
   * @returns Prediction result with disease name, confidence, and result
   */
  predict: async (imageData: string): Promise<PredictionResponse> => {
    try {
      const response = await api.post<PredictionResponse>('/predict', {
        imageData,
      });
      return response.data;
    } catch (error: any) {
      console.error('Prediction service error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Prediction failed. Please try again.');
    }
  },

  /**
   * Check if prediction service is healthy
   * @returns true if service is available
   */
  isHealthy: async (): Promise<boolean> => {
    try {
      const response = await api.get<{ status: string; mlServiceAvailable: boolean }>('/predict/health');
      return response.data.mlServiceAvailable;
    } catch (error) {
      console.warn('Prediction service health check failed');
      return false;
    }
  },
};
