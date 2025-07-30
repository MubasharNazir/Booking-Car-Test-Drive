from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.cars import router as cars_router
from app.api.chat import router as chat_router
from app.api.upload import router as upload_router
from app.api.booking import router as booking_router
from app.db.models import Base
from app.db.session import engine
import asyncio

# from app.core.config import settings  # To be implemented

app = FastAPI(title="Smart Car Platform API", version="1.0.0")

# CORS setup (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

app.include_router(cars_router)
app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(booking_router)

@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
