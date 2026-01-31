from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import users
from app.routers import reports
from app.database import init_db
from app.services.file_service import ensure_directories

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ASCENT API",
    description="ASCENT Backend API",
    version="0.1.0",
)

# CORS configuration for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://www.halalhaven.kr"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(reports.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables and upload directories on startup."""
    try:
        init_db()
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    
    # Create upload directories
    ensure_directories()
    print("Upload directories initialized")
    
    # Mount static files for uploads
    uploads_path = Path("/app/uploads")
    if uploads_path.exists():
        app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/hello")
def hello():
    """Hello endpoint."""
    return {"message": "Hello from ASCENT"}
