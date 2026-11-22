package com.tomatoleaf.service;

import com.tomatoleaf.dto.PredictionRequestDTO;
import com.tomatoleaf.dto.PredictionResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {

    private static final Logger logger = LoggerFactory.getLogger(PredictionService.class);

    private final RestTemplate restTemplate;
    
    @Value("${ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;
    
    @Value("${ml-service.predict.endpoint:/predict}")
    private String predictEndpoint;
    
    @Value("${ml-service.timeout:30000}")
    private long timeoutMs;

    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Send prediction request to ML service and get disease prediction
     *
     * @param request PredictionRequestDTO with base64 encoded image
     * @return PredictionResponseDTO with disease prediction
     * @throws RestClientException if ML service call fails
     */
    public PredictionResponseDTO predict(PredictionRequestDTO request) {
        try {
            String url = mlServiceUrl + predictEndpoint;
            logger.info("Calling ML service at: {}", url);

            // Create request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("imageData", request.imageData());

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Call ML service
            long startTime = System.currentTimeMillis();
            ResponseEntity<PredictionResponseDTO> response = restTemplate.postForEntity(
                    url,
                    entity,
                    PredictionResponseDTO.class
            );
            long duration = System.currentTimeMillis() - startTime;

            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("ML service returned non-success status: {}", response.getStatusCode());
                throw new RuntimeException("ML service error: " + response.getStatusCode());
            }

            PredictionResponseDTO prediction = response.getBody();
            if (prediction == null) {
                logger.error("ML service returned null response");
                throw new RuntimeException("ML service returned empty response");
            }

            logger.info("Prediction successful in {}ms - Disease: {}, Confidence: {:.2%}, Result: {}",
                    duration, prediction.displayName(), prediction.confidence(), prediction.result());

            return prediction;

        } catch (RestClientException e) {
            logger.error("Failed to call ML service: {}", e.getMessage(), e);
            throw new RuntimeException("ML service unavailable: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during prediction: {}", e.getMessage(), e);
            throw new RuntimeException("Prediction failed: " + e.getMessage(), e);
        }
    }

    /**
     * Check if ML service is healthy
     *
     * @return true if service is reachable and model is loaded
     */
    public boolean isHealthy() {
        try {
            String url = mlServiceUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.warn("ML service health check failed: {}", e.getMessage());
            return false;
        }
    }
}
