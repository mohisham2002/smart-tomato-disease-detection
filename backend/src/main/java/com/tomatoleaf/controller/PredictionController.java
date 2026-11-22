package com.tomatoleaf.controller;

import com.tomatoleaf.dto.PredictionRequestDTO;
import com.tomatoleaf.dto.PredictionResponseDTO;
import com.tomatoleaf.service.PredictionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
public class PredictionController {

    private static final Logger logger = LoggerFactory.getLogger(PredictionController.class);

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    /**
     * Get prediction for a leaf image
     *
     * @param request PredictionRequestDTO containing base64 encoded image data
     * @return PredictionResponseDTO with disease prediction result
     */
    @PostMapping
    public ResponseEntity<PredictionResponseDTO> predict(@Valid @RequestBody PredictionRequestDTO request) {
        logger.info("Received prediction request");

        try {
            PredictionResponseDTO prediction = predictionService.predict(request);
            logger.info("Prediction completed successfully");
            return ResponseEntity.ok(prediction);

        } catch (RuntimeException e) {
            logger.error("Prediction failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .build();
        } catch (Exception e) {
            logger.error("Unexpected error during prediction: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    /**
     * Health check for prediction service
     *
     * @return Status of the prediction service
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        logger.debug("Health check requested for prediction service");

        boolean mlServiceHealthy = predictionService.isHealthy();

        Map<String, Object> response = new HashMap<>();
        response.put("status", mlServiceHealthy ? "healthy" : "unhealthy");
        response.put("service", "prediction-service");
        response.put("mlServiceAvailable", mlServiceHealthy);

        HttpStatus status = mlServiceHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return new ResponseEntity<>(response, status);
    }
}
