from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routes
from routes import auth_routes, bet_routes, transaction_routes, admin_routes
from database import init_db

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Rudrabet API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Rudrabet API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "rudrabet-api"}

# Include all route modules
api_router.include_router(auth_routes.router)
api_router.include_router(bet_routes.router)
api_router.include_router(transaction_routes.router)
api_router.include_router(admin_routes.router)

# Include the router in the main app
app.include_router(api_router)

# Serve uploaded files
uploads_dir = "/app/backend/uploads"
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully")

@app.on_event("shutdown")
async def shutdown_db():
    logger.info("Shutting down...")
