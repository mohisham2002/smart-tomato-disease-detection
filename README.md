# TomatoLeaf Disease Detection System

TomatoLeaf is a full-stack application that identifies tomato leaf diseases from uploaded images. It uses a React interface, a Spring Boot API, and a TensorFlow/FastAPI model service.

## Features

- User registration and login
- JWT-based authentication
- Tomato leaf image upload
- Disease prediction and confidence score
- Disease detection history
- User profile and administration pages
- Feedback and notification management
- Admin dashboard

## Disease Classes

The model can classify:

1. Bacterial Spot
2. Early Blight
3. Late Blight
4. Leaf Mold
5. Septoria Leaf Spot
6. Spider Mites
7. Target Spot
8. Yellow Leaf Curl Virus
9. Mosaic Virus
10. Healthy

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Java 17, Spring Boot 3, Spring Security, JPA |
| Database | MySQL 8 |
| ML Service | Python, FastAPI, TensorFlow, MobileNetV3 |

## Project Structure

```text
tomatoleaf/
├── frontend/      React and TypeScript web application
├── backend/       Spring Boot REST API
├── ml-service/    FastAPI prediction service and trained model
└── README.md
```

## Architecture

```text
Browser
  -> React on port 5173
  -> Spring Boot API on port 8080
  -> FastAPI ML service on port 8000
  -> TensorFlow MobileNetV3 model
```

## Prerequisites

Install:

- Java 17 or newer
- Maven 3.8 or newer
- Python 3.10
- Node.js 18 or newer
- npm
- MySQL 8
- Git

Verify the tools:

```powershell
java -version
mvn -v
python --version
node --version
npm --version
mysql --version
```

## Local Setup

### 1. Clone or download the project

```powershell
git clone https://github.com/YOUR_USERNAME/tomatoleaf.git
cd tomatoleaf
```

### 2. Configure MySQL

Start MySQL and create the database:

```sql
CREATE DATABASE tomato_leaf_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Set the database username and password as environment variables before starting Spring Boot:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_MYSQL_PASSWORD"
$env:JWT_SECRET = "YOUR_LONG_RANDOM_JWT_SECRET"
```

Do not commit real database passwords or JWT secrets.

### 3. Start the ML service

Open Terminal 1:

```powershell
cd E:\tomatoleaf\ml-service
py -3.10 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Expected address:

```text
http://localhost:8000
```

Health check:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

API documentation:

```text
http://localhost:8000/docs
```

### 4. Start the backend

Open Terminal 2:

```powershell
cd E:\tomatoleaf\backend
mvn spring-boot:run
```

Backend address:

```text
http://localhost:8080
```

The backend creates or updates the required tables automatically through JPA.

### 5. Start the frontend

Open Terminal 3:

```powershell
cd E:\tomatoleaf\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Default Development Admin

The application creates a development admin when the database is first initialized:

```text
Email: admin@gmail.com
Password: Admin123
```

Change this password immediately after the first login and replace the development credentials before deploying the project publicly.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | ML service health |
| POST | `/predict` | Predict from ML service |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/predict` | Predict through Spring Boot |
| GET | `/api/detections/my` | Get current user's detections |

## Production Notes

- Never commit `.env` files or passwords.
- Replace the development JWT secret.
- Replace the default administrator account.
- Configure MySQL and service URLs through environment variables.
- Restrict CORS origins to your deployed frontend.
- Run the frontend, backend, and ML service behind HTTPS.
- Store or distribute the trained model according to its license and size.

## Build Commands

Backend:

```powershell
cd backend
mvn clean package
```

Frontend:

```powershell
cd frontend
npm run build
```

## Troubleshooting

### ML service cannot find the model

Make sure [best_mobilenetv3_finetuned.h5](ml-service/best_mobilenetv3_finetuned.h5) exists in the `ml-service` directory.

### Backend cannot connect to MySQL

- Check that MySQL is running.
- Check `DB_USERNAME` and `DB_PASSWORD`.
- Confirm that port `3306` is available.
- Confirm that `tomato_leaf_db` exists or is permitted to be created.

### Frontend cannot reach the backend

- Keep the backend running on port `8080`.
- Keep the frontend running on port `5173`.
- Check browser developer tools for CORS or network errors.

### TensorFlow cannot start

Use Python 3.10. TensorFlow 2.16.2 does not support every newer Python release.
