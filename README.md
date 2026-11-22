# 🍅 TomatoLeaf - Disease Detection System

A full-stack web application for identifying tomato leaf diseases using machine learning. The system combines a **React frontend**, **Spring Boot backend**, and a **Python ML service** to provide real-time disease predictions with high accuracy.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

---

## 🎯 Overview

**TomatoLeaf** is an intelligent disease detection system designed to help farmers and agricultural professionals:

- ✅ Upload tomato leaf images
- ✅ Get instant AI-powered disease predictions
- ✅ View prediction confidence scores
- ✅ Maintain detection history
- ✅ Track diseases across their farms
- ✅ Receive detailed disease information

The system can detect **10 different disease classes**:
1. Bacterial Spot
2. Early Blight
3. Late Blight
4. Leaf Mold
5. Septoria Leaf Spot
6. Spider Mites
7. Target Spot
8. Yellow Leaf Curl Virus
9. Mosaic Virus
10. Healthy (no disease)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌──────────────────────┐
│  Spring Boot Backend │ (Port 8080)
│  (Java 17)           │
└────────┬─────────────┘
         │ HTTP/REST
         ↓
┌──────────────────────┐
│  FastAPI ML Service  │ (Port 8000)
│  (Python)            │
│  - Load Model        │
│  - Predict Disease   │
└──────────────────────┘
         │
         ↓
┌──────────────────────┐
│  TensorFlow Model    │
│  (.h5 file)          │
└──────────────────────┘
```

### Data Flow

```
User Upload
    ↓
Frontend: Image → Base64
    ↓
Backend: POST /api/predict
    ↓
ML Service: POST /predict
    ↓
Model: Inference
    ↓
Backend: JSON Response
    ↓
Frontend: Display Result + Save History
```

---

## 📋 Prerequisites

Make sure you have the following installed:

### Global Requirements
- **Git** - Version control
- **Docker** (optional) - For containerization

### Backend Requirements
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - [Download](https://www.mysql.com/downloads/)

### ML Service Requirements
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **pip** - Python package manager (comes with Python)

### Frontend Requirements
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** - (comes with Node.js)

---

## 💾 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tomatoleaf.git
cd tomatoleaf
```

### 2. Database Setup

Create MySQL database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE tomato_leaf_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Note:** Set the database credentials as environment variables:

```properties
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 3. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
```

**Important:** Make sure your trained model file is in the correct location:
```
ml-service/
└── best_mobilenetv3_finetuned.h5  (Your model file)
```

### 4. Backend Setup

```bash
cd backend
mvn clean install
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

---

## 🚀 Running the Application

### Start in Order (Important!)

#### Step 1: Start ML Service (FastAPI)

```bash
cd ml-service
python app.py
```

Expected output:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ ML Service running at: `http://localhost:8000`

#### Step 2: Start Spring Boot Backend

Open a new terminal:

```bash
cd backend
mvn spring-boot:run
```

Expected output:
```
TomatoLeafApplication        : Started TomatoLeafApplication in 5.234 seconds
```

✅ Backend running at: `http://localhost:8080`

#### Step 3: Start React Frontend

Open another new terminal:

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 234 ms
➜  Local:   http://localhost:5173/
```

✅ Frontend running at: `http://localhost:5173`

### Quick Start (All Services)

If you want to start all services quickly, you can use:

**On Linux/Mac:**
```bash
# Terminal 1
cd ml-service && python app.py

# Terminal 2
cd backend && mvn spring-boot:run

# Terminal 3
cd frontend && npm run dev
```

**On Windows (PowerShell):**
```powershell
# Open 3 separate PowerShell windows and run:
# Window 1
cd ml-service; python app.py

# Window 2
cd backend; mvn spring-boot:run

# Window 3
cd frontend; npm run dev
```

---

## 📡 API Documentation

### FastAPI ML Service (Port 8000)

#### Health Check
```http
GET http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

#### Prediction
```http
POST http://localhost:8000/predict
Content-Type: application/json

{
  "imageData": "base64_encoded_image_string"
}
```

Response:
```json
{
  "diseaseName": "Tomato___Early_blight",
  "displayName": "Early Blight",
  "confidence": 0.92,
  "result": "Diseased"
}
```

---

### Spring Boot Backend (Port 8080)

#### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Predict Disease
```http
POST http://localhost:8080/api/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageData": "base64_encoded_image_string"
}
```

Response:
```json
{
  "diseaseName": "Tomato___Early_blight",
  "displayName": "Early Blight",
  "confidence": 0.92,
  "result": "Diseased"
}
```

#### Prediction Service Health
```http
GET http://localhost:8080/api/predict/health
Authorization: Bearer <token>
```

Response:
```json
{
  "status": "healthy",
  "service": "prediction-service",
  "mlServiceAvailable": true
}
```

#### Create Detection Record
```http
POST http://localhost:8080/api/detections
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageName": "leaf_photo.jpg",
  "imageData": "base64_string",
  "diseaseName": "Early Blight",
  "confidence": 0.92,
  "result": "Diseased"
}
```

#### Get My Detections
```http
GET http://localhost:8080/api/detections/my
Authorization: Bearer <token>
```

#### Get Detection by ID
```http
GET http://localhost:8080/api/detections/{id}
Authorization: Bearer <token>
```

---

## 📁 Project Structure

```
tomatoleaf/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/tomatoleaf/
│   │   ├── TomatoLeafApplication.java
│   │   ├── config/                   # Configuration classes
│   │   │   ├── GlobalCorsConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── PredictionController.java
│   │   │   ├── DetectionHistoryController.java
│   │   │   └── ...
│   │   ├── service/                  # Business Logic
│   │   │   ├── PredictionService.java (NEW - ML Integration)
│   │   │   ├── DetectionHistoryService.java
│   │   │   └── ...
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── PredictionRequestDTO.java (NEW)
│   │   │   ├── PredictionResponseDTO.java (NEW)
│   │   │   └── ...
│   │   ├── entity/                   # JPA Entities
│   │   ├── repository/               # Data Access Layer
│   │   └── security/                 # Security Configuration
│   ├── src/main/resources/
│   │   └── application.properties     # Configuration
│   ├── pom.xml                       # Maven Dependencies
│   └── target/                       # Build Output
│
├── ml-service/                       # FastAPI ML Service
│   ├── app.py                        # FastAPI Application (NEW)
│   ├── best_mobilenetv3_finetuned.h5# Trained Model
│   ├── requirements.txt               # Python Dependencies (NEW)
│   └── tometo leaf-disease.ipynb     # Training Notebook
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UploadPage.tsx        # Disease Detection (UPDATED)
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── DetectionCard.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── predictionService.ts  # ML API Client (NEW)
│   │   │   ├── detectionService.ts
│   │   │   ├── userService.ts
│   │   │   └── ...
│   │   ├── types/
│   │   │   ├── detection.ts
│   │   │   └── ...
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
│
└── README.md                        # This File

```

---

## ✨ Features

### Frontend Features
- 🖼️ **Image Upload** - Drag and drop or click to upload leaf images
- 📊 **Disease Detection** - Real-time AI predictions
- 📈 **Confidence Scores** - Visual confidence indicators
- 📚 **Detection History** - View all past predictions
- 🔐 **User Authentication** - Secure login and registration
- 👤 **User Dashboard** - Personal detection statistics
- 🔄 **Re-detection** - Re-analyze previous images
- 🏷️ **Tagging System** - Organize and tag detections
- 📝 **Notes** - Add custom notes to detections

### Backend Features
- ✅ **ML Integration** - Seamless connection to FastAPI
- ⏱️ **Timeout Handling** - 30-second prediction timeout
- 🔄 **Error Recovery** - Graceful error handling
- 📊 **Detection Storage** - Persistent detection history
- 🔐 **JWT Authentication** - Secure API endpoints
- 👨‍💼 **Admin Dashboard** - User and analytics management
- 📡 **Health Checks** - Service status monitoring
- 🌐 **CORS Support** - Cross-origin requests enabled

### ML Service Features
- 🧠 **Model Efficiency** - MobileNetV3 for fast inference
- 💾 **Startup Loading** - Model loaded once at boot
- 🔢 **Batch Support** - Process single images
- 📊 **Confidence Scores** - Return prediction confidence
- ⚡ **Fast Inference** - Sub-second predictions
- 📝 **Comprehensive Logging** - Detailed error messages

---

## ⚙️ Configuration

### ML Service Configuration

File: `ml-service/app.py`

```python
# Adjust these in the code if needed:
DISEASE_CLASSES = {...}  # Adjust disease mapping
DISEASE_DISPLAY_NAMES = {...}  # Adjust display names
```

### Backend Configuration

File: `backend/src/main/resources/application.properties`

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/tomato_leaf_db
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}

# ML Service (Primary Configuration)
ml-service.url=http://localhost:8000              # ML service URL
ml-service.predict.endpoint=/predict               # Prediction endpoint
ml-service.timeout=30000                           # Timeout in milliseconds

# JWT
jwt.secret=${JWT_SECRET:}
jwt.expiration=${JWT_EXPIRATION_MS:86400000}

# Logging
logging.level.com.tomatoleaf=DEBUG
logging.level.org.springframework.security=INFO

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend Configuration

File: `frontend/src/services/userService.ts`

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // Backend URL
  timeout: 10000,
});
```

---

## 🐛 Troubleshooting

### Issue: ML Service Not Found

**Error:** `Failed to call ML service: Connection refused`

**Solution:**
1. Make sure FastAPI is running: `python ml-service/app.py`
2. Check it's accessible: `curl http://localhost:8000/health`
3. Verify URL in `application.properties`

---

### Issue: Model Not Loading

**Error:** `Model not loaded - model file not found`

**Solution:**
1. Ensure model file exists: `ml-service/best_mobilenetv3_finetuned.h5`
2. Check file permissions
3. Try absolute path in config if relative path fails

---

### Issue: Database Connection Error

**Error:** `com.mysql.cj.jdbc.exceptions.CommunicationException`

**Solution:**
1. Start MySQL: `mysql -u root -p`
2. Create database: `CREATE DATABASE tomato_leaf_db;`
3. Update credentials in `application.properties`
4. Verify connection: `mysql -u root -p tomato_leaf_db`

---

### Issue: Frontend Can't Connect to Backend

**Error:** `CORS error` or `Failed to fetch`

**Solution:**
1. Ensure backend is running on port 8080
2. Check CORS is enabled in `GlobalCorsConfig.java`
3. Frontend should be on `http://localhost:5173`
4. Try: `curl http://localhost:8080/api/predict/health`

---

### Issue: Prediction Takes Too Long

**Error:** `Request timeout`

**Solution:**
1. Increase timeout in `application.properties`: `ml-service.timeout=60000`
2. Check ML service health: `GET /health`
3. Monitor system resources (CPU, RAM)
4. Check GPU availability for faster inference

---

### Issue: Out of Memory Error

**Error:** `java.lang.OutOfMemoryError` or similar

**Solution:**
1. Increase Java heap: `export MAVEN_OPTS="-Xmx1024m"`
2. Or run: `mvn -DargLine="-Xmx1024m" spring-boot:run`
3. For Python: Reduce batch size or upgrade hardware

---

## 🧪 Development

### Adding New Disease Classes

1. Update FastAPI `app.py`:
```python
DISEASE_CLASSES = {
    10: "Tomato___new_disease",  # Add here
    ...
}

DISEASE_DISPLAY_NAMES = {
    "Tomato___new_disease": "New Disease Name",
    ...
}
```

2. Retrain and save model as `best_mobilenetv3_finetuned.h5`

### Adding New Endpoints

**Backend (Spring Boot):**
```java
@RestController
@RequestMapping("/api/new-feature")
public class NewFeatureController {
    @PostMapping
    public ResponseEntity<NewFeatureDTO> create(@RequestBody NewFeatureDTO request) {
        // Implementation
        return ResponseEntity.ok(result);
    }
}
```

**Frontend (React + TypeScript):**
```typescript
export const newFeatureService = {
  create: async (data: NewFeatureDTO): Promise<NewFeatureDTO> => {
    const response = await api.post<NewFeatureDTO>('/new-feature', data);
    return response.data;
  },
};
```

### Running Tests

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

---

## 📊 Performance Metrics

| Component | Metric | Value |
|-----------|--------|-------|
| **Frontend** | Build Time | ~2-3 seconds |
| **Frontend** | Bundle Size | ~500KB (gzipped) |
| **Backend** | Startup Time | ~5 seconds |
| **Backend** | Response Time | ~100-200ms |
| **ML Service** | Model Load Time | ~10-15 seconds |
| **ML Service** | Inference Time | ~500-800ms per image |
| **ML Service** | Memory Usage | ~2GB (with model) |

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For issues, questions, or suggestions:

- 📧 Email: support@tomatoleaf.com
- 🐛 GitHub Issues: [Issue Tracker](https://github.com/yourusername/tomatoleaf/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/tomatoleaf/discussions)

---

## 🎓 Model Information

**Model Architecture:** MobileNetV3
**Framework:** TensorFlow/Keras
**Input Size:** 224×224 pixels
**Classes:** 10 (9 diseases + 1 healthy)
**Training Data:** [Specify your dataset]
**Accuracy:** [Specify your model accuracy]

---

## 🙏 Acknowledgments

- Model training based on TensorFlow tutorials
- UI components inspired by modern agricultural apps
- Thanks to all contributors and testers

---

**Last Updated:** April 26, 2026

**Version:** 1.0.0

Happy farming! 🍅
