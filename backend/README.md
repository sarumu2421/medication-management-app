# Medication Management Backend

FastAPI backend for the medication management application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Access the API documentation at: http://localhost:8000/docs

## API Endpoints

- `POST /api/medications/` - Create a new medication
- `GET /api/medications/` - List all medications
- `GET /api/medications/{id}` - Get a specific medication
- `PUT /api/medications/{id}` - Update a medication
- `DELETE /api/medications/{id}` - Delete a medication
- `POST /api/medications/check-interactions` - Check drug interactions

## Database

Uses SQLite for development (medications.db file created automatically).
