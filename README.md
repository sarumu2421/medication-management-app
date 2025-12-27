# Medication Management App

A web application that helps users manage medication schedules and receive alerts for potential drug-drug interactions.

## Features

- ✅ Add medications with name and schedule
- ✅ View all active medications
- ✅ Check for drug-drug interactions using OpenFDA API
- ✅ Receive reminders (console logs initially)
- ✅ Delete/deactivate medications

## Tech Stack

### Frontend
- **React** with Vite
- Simple, functional UI
- Axios for API calls

### Backend
- **Python + FastAPI**
- REST API architecture
- SQLAlchemy ORM

### Database
- **SQLite** (for development)
- Can be upgraded to PostgreSQL

### APIs
- **OpenFDA** for drug interaction checking

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Add Medication**: Fill out the form with medication name, dosage, frequency, and schedule time(s)
2. **View Medications**: See all your active medications in the list below
3. **Check Interactions**: Click "Check Drug Interactions" button to check for potential interactions
4. **Delete Medication**: Click the × button on any medication card to remove it

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /api/medications/` - Create a new medication
- `GET /api/medications/` - List all medications
- `GET /api/medications/{id}` - Get a specific medication
- `PUT /api/medications/{id}` - Update a medication
- `DELETE /api/medications/{id}` - Delete a medication
- `POST /api/medications/check-interactions` - Check drug interactions

## Notifications

Currently, notifications are logged to the console. This can be upgraded to:
- Email notifications
- SMS notifications
- Push notifications

## Security & Disclaimer

⚠️ **This is a demonstration application**. Always consult your healthcare provider for medical advice. The drug interaction data comes from OpenFDA and may not be complete or up-to-date.

## Future Enhancements

- Email/SMS notifications
- User authentication
- Reminder scheduler with actual time-based alerts
- Mobile app
- PostgreSQL database
- More comprehensive drug interaction database
- Medication history and tracking
