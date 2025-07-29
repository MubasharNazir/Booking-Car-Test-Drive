from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from enum import Enum

class TransmissionEnum(str, Enum):
    automatic = "automatic"
    manual = "manual"

class FuelTypeEnum(str, Enum):
    petrol = "petrol"
    diesel = "diesel"
    electric = "electric"
    hybrid = "hybrid"
    other = "other"

class CarCreate(BaseModel):
    company_name: str
    model: str
    year: int
    price: float
    mileage: int
    color: str
    transmission: TransmissionEnum
    fuel_type: FuelTypeEnum
    description: Optional[str] = None
    images: List[HttpUrl] = Field(default_factory=list)
    video: Optional[HttpUrl] = None
    features: List[str] = Field(default_factory=list)
    embedding: Optional[List[float]] = None
    available_for_test_drive: Optional[bool] = True

class Car(CarCreate):
    id: int

    class Config:
        orm_mode = True 