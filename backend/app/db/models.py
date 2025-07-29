from sqlalchemy import Column, Integer, String, Float, Text, Enum, Boolean, DateTime, ForeignKey, Date, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from pgvector.sqlalchemy import Vector
import enum
from datetime import datetime

Base = declarative_base()

class TransmissionEnum(enum.Enum):
    automatic = "automatic"
    manual = "manual"

class FuelTypeEnum(enum.Enum):
    petrol = "petrol"
    diesel = "diesel"
    electric = "electric"
    hybrid = "hybrid"
    other = "other"

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    mileage = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    transmission = Column(Enum(TransmissionEnum), nullable=False)
    fuel_type = Column(Enum(FuelTypeEnum), nullable=False)
    description = Column(Text)
    images = Column(JSONB, default=list)  # List of URLs
    video = Column(String)  # URL
    features = Column(JSONB, default=list)  # List of strings
    embedding = Column(Vector(384), nullable=True)
    available_for_test_drive = Column(Boolean, default=True)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    slot_start = Column(DateTime, nullable=False)
    slot_end = Column(DateTime, nullable=False)
    status = Column(String, default="booked") 

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="user")  # 'user' or 'dealer'
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Dealer-specific fields
    company_name = Column(String)
    company_license_number = Column(String)
    company_address = Column(String)
    company_phone = Column(String)
    company_website = Column(String)
    # Add more as needed
    __table_args__ = (UniqueConstraint('email', name='uq_user_email'),) 