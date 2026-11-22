# TomatoLeaf – Tomato Disease Detection System

## About the Project

TomatoLeaf is a web-based application that uses Machine Learning to detect diseases in tomato leaves. Users can upload an image of a tomato leaf and get a prediction showing whether the plant is healthy or affected by a disease.

The system can identify 10 different classes, including 9 tomato diseases and healthy leaves. It also displays the prediction confidence and saves previous detection results so users can view their history.

## Technologies Used

- **Frontend:** React with TypeScript
- **Backend:** Java Spring Boot
- **Machine Learning:** Python, TensorFlow and Keras
- **ML API:** FastAPI
- **Database:** MySQL
- **Model:** Fine-tuned MobileNetV3

## How the Project Works

The application has three main parts:

1. **React Frontend:** Allows users to register, log in, upload leaf images and view prediction results.
2. **Spring Boot Backend:** Handles user authentication, communicates with the ML service and manages prediction history.
3. **Python ML Service:** Loads the trained model, processes uploaded images and returns disease predictions with confidence scores.

When a user uploads an image, the React frontend sends it to the Spring Boot backend. The backend forwards the image to the FastAPI service, where the trained model makes the prediction. The result is then returned to the frontend and saved in the database.

## How to Start the Project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tomatoleaf
```

### 2. Set Up the Database

Open MySQL and create the database:

```sql
CREATE DATABASE tomato_leaf_db;
```

Configure your MySQL username and password in the Spring Boot `application.properties` file.

### 3. Set Up the Machine Learning Service

Open a terminal:

```bash
cd ml-service
pip install -r requirements.txt
```

Make sure the trained model file `best_mobilenetv3_finetuned.h5` is inside the `ml-service` folder.

Start the ML service:

```bash
python app.py
```

It should run on port `8000`.

### 4. Start the Spring Boot Backend

Open another terminal:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend should run on port `8080`.

### 5. Start the React Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run on port `5173`.

## Running the Application

Once all three services are running, open:

```text
http://localhost:5173
```

You can now register an account, log in, upload a tomato leaf image and view the disease prediction.

**Important:** Start the ML service first, then the Spring Boot backend, and finally the React frontend.