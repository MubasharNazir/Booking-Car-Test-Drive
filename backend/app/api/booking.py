from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from datetime import datetime, timedelta, time
from app.db.session import get_db
from app.db.models import Booking, Car
from app.schemas.booking import BookingCreate, Booking as BookingSchema
from typing import List

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

# Standard slots: 8:00–9:00, 9:00–10:00, ..., 17:00–18:00
SLOT_START_TIMES = [time(h, 0) for h in range(8, 17)]
SLOT_DURATION = timedelta(hours=1)

@router.get("/available-slots/{car_id}", response_model=List[str])
async def get_available_slots(car_id: int, date: str, db: AsyncSession = Depends(get_db)):
    # Parse date
    try:
        day = datetime.strptime(date, "%Y-%m-%d").date()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    # Check car availability
    car = await db.get(Car, car_id)
    if not car or not car.available_for_test_drive:
        return []
    # Generate all slots for the day
    all_slots = []
    for start_t in SLOT_START_TIMES:
        slot_start = datetime.combine(day, start_t)
        slot_end = slot_start + SLOT_DURATION
        all_slots.append((slot_start, slot_end))
    # Get booked slots
    stmt = select(Booking).where(
        Booking.car_id == car_id,
        Booking.status == "booked",
        or_(
            and_(Booking.slot_start >= all_slots[0][0], Booking.slot_start < all_slots[-1][1]),
            and_(Booking.slot_end > all_slots[0][0], Booking.slot_end <= all_slots[-1][1])
        )
    )
    result = await db.execute(stmt)
    bookings = result.scalars().all()
    booked_ranges = [(b.slot_start, b.slot_end) for b in bookings]
    # Filter out booked slots
    available = []
    for slot_start, slot_end in all_slots:
        if not any(bs < slot_end and be > slot_start for bs, be in booked_ranges):
            available.append(f"{slot_start.strftime('%H:%M')}–{slot_end.strftime('%H:%M')}")
    return available

@router.post("/", response_model=BookingSchema, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db)):
    # Check car availability
    car = await db.get(Car, booking.car_id)
    if not car or not car.available_for_test_drive:
        raise HTTPException(status_code=400, detail="Car not available for test drive.")
    # Check for overlapping bookings
    stmt = select(Booking).where(
        Booking.car_id == booking.car_id,
        Booking.status == "booked",
        Booking.slot_start < booking.slot_end,
        Booking.slot_end > booking.slot_start
    )
    result = await db.execute(stmt)
    overlap = result.scalars().first()
    if overlap:
        raise HTTPException(status_code=409, detail="This slot is already booked.")
    db_booking = Booking(**booking.dict())
    db.add(db_booking)
    await db.commit()
    await db.refresh(db_booking)
    return db_booking 