from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    car_id: int
    slot_start: datetime
    slot_end: datetime

class Booking(BookingCreate):
    id: int
    status: str = Field(default="booked")

    class Config:
        from_attributes = True 