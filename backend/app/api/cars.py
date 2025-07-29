from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db import models
from app.schemas.car import CarCreate, Car
from app.utils.embedding import get_car_embedding

router = APIRouter(prefix="/api/cars", tags=["Cars"])

@router.post("/", response_model=Car, status_code=status.HTTP_201_CREATED)
async def create_car(car: CarCreate, db: AsyncSession = Depends(get_db)):
    car_data = car.model_dump()
    # Convert HttpUrl and enums to str
    car_data["images"] = [str(url) for url in car_data.get("images", [])]
    if car_data.get("video"):
        car_data["video"] = str(car_data["video"])
    car_data["transmission"] = car_data["transmission"].value
    car_data["fuel_type"] = car_data["fuel_type"].value
    # Generate embedding from car details (company, model, year, description, features)
    text_for_embedding = f"{car_data['company_name']} {car_data['model']} {car_data['year']} {car_data.get('description', '')} {' '.join(car_data.get('features', []))}"
    car_data["embedding"] = get_car_embedding(text_for_embedding)
    db_car = models.Car(**car_data)
    db.add(db_car)
    await db.commit()
    await db.refresh(db_car)
    return db_car 