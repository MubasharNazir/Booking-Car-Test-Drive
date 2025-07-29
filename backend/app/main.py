# # from app.api.cars import router as cars_router
# # app.include_router(cars_router)
# from fastapi import FastAPI
# from app.api.cars import router as cars_router  # import your cars router

# app = FastAPI()

# # Include the cars router under the path /cars (optional)
# app.include_router(cars_router, prefix="/cars")

# # Optional root endpoint for sanity check
# @app.get("/")
# async def root():
#     return {"message": "FastAPI app is running!"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.cars import router as cars_router
from app.api.chat import router as chat_router
from app.api.upload import router as upload_router
from app.api.booking import router as booking_router


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


app.include_router(cars_router)
app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(booking_router)
@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
