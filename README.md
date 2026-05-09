# HeartGuard AI System

An AI-powered heart disease prediction web application built with React, Vite, FastAPI, and a trained machine learning model. The app allows users to enter clinical health parameters, receive a risk prediction, and view a clean health report with confidence score, risk level, and practical recommendations.

## Live Demo

Frontend:
```text
https://heart-guard-ai-system-front.vercel.app
```

Backend API:
```text
https://heartguard-ai-system-backend.onrender.com
```

Health check:
```text
https://heartguard-ai-system-backend.onrender.com/healthz
```

## Project Highlights

- Built a full-stack ML application with separate frontend and backend deployments.
- Integrated a trained heart disease prediction model through a FastAPI REST API.
- Designed role-based screens for patient and doctor workflows.
- Added downloadable/exportable prediction reports.
- Deployed frontend on Vercel and backend on Render.
- Configured production environment variables and CORS for secure frontend-backend communication.
- Added fallback frontend estimation so the UI remains usable if the API is temporarily unavailable.

## Features

- Heart disease risk prediction from clinical inputs
- Risk level classification: Low, Medium, High
- Model confidence score
- Patient dashboard with vitals and prediction history
- Doctor dashboard with patient risk overview
- Reports page with export options
- Responsive UI for desktop and mobile
- Production deployment with Vercel and Render

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Backend | FastAPI, Uvicorn |
| Machine Learning | scikit-learn, pandas, NumPy, joblib |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Architecture

```text
User
  |
  v
React + Vite Frontend
  |
  | POST /predict
  v
FastAPI Backend on Render
  |
  v
Trained ML Model
  |
  v
Prediction + Probability + Risk Level
```

## Prediction Inputs

The model uses the following health parameters:

- Age
- Sex
- Chest pain type
- Resting blood pressure
- Cholesterol
- Fasting blood sugar
- Resting ECG
- Maximum heart rate
- Exercise-induced angina
- Oldpeak ST depression
- ST slope

## Local Setup

Clone the repository:

```bash
git clone https://github.com/dhruv150304/HeartGuard-AI-System-front.git
cd HeartGuard-AI-System-front
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```text
VITE_API_URL=http://localhost:8001
```

Start the development server:

```bash
npm run dev
```

## Production Environment

For Vercel, add this environment variable:

```text
VITE_API_URL=https://heartguard-ai-system-backend.onrender.com
```

Vercel settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Backend Repository

The backend source code is available here:

```text
https://github.com/dhruv150304/HeartGuard-AI-System-backend
```

## API Endpoint Used

```text
POST /predict
```

Example response:

```json
{
  "prediction": 0,
  "probability": 22,
  "confidence": 78,
  "risk": "Low",
  "label": "No heart disease risk detected"
}
```

## Important Note

This project is designed for educational and screening purposes only. It does not replace medical diagnosis, clinical testing, or advice from a qualified healthcare professional.

## Author

Dhruv Kansal

GitHub:
```text
https://github.com/dhruv150304
```
