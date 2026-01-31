# ASCENT

Development environment for ASCENT healthcare application.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript + Tailwind CSS 4 (port 5173)
- **Backend**: FastAPI + Python 3.12 (port 9090)

## Quick Start

```bash
# Start all services
./deploy_dev.sh
```

Or manually:

```bash
# Build and start
docker compose up --build

# Stop all services
docker compose down
```

## Services

| Service  | URL                   | Description         |
| -------- | --------------------- | ------------------- |
| Frontend | http://localhost:5173 | React application   |
| Backend  | http://localhost:9090 | FastAPI application |

## API Endpoints

- `GET /health` - Health check, returns `{"status": "ok"}`
- `GET /hello` - Hello endpoint, returns `{"message": "Hello from ASCENT"}`

## Environment Variables

### Frontend

| Variable            | Required | Description          | Example                 |
| ------------------- | -------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Yes      | Backend API base URL | `http://localhost:9090` |

### Backend

No environment variables required for basic setup.

## Configuration Files

### .env.example

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Docker Compose Environment

Environment variables are configured in `docker-compose.yml`:

```yaml
frontend:
  environment:
    - VITE_API_BASE_URL=http://localhost:9090

backend:
  environment:
    # Add backend env vars here when needed
```

## Project Structure

```
healthcare_hackathon/
├── docker-compose.yml      # Docker Compose configuration
├── deploy_dev.sh           # Development deployment script
├── .env.example            # Example environment variables
├── backend/
│   ├── Dockerfile          # Backend container config
│   ├── requirements.txt    # Python dependencies
│   └── app/
│       ├── __init__.py
│       └── main.py         # FastAPI application
└── frontend/
    ├── Dockerfile          # Frontend container config
    ├── package.json        # Node dependencies
    ├── vite.config.ts      # Vite configuration
    ├── tsconfig.json       # TypeScript configuration
    ├── index.html          # HTML entry point
    └── src/
        ├── main.tsx        # React entry point
        ├── App.tsx         # Main React component
        ├── index.css       # Tailwind CSS imports
        └── vite-env.d.ts   # Vite type definitions
```

## Development Notes

- Frontend has hot reload enabled via Vite
- Backend has auto-reload enabled via uvicorn
- Both services mount source code as volumes for live editing
- Missing environment variables will show an error screen in the frontend
