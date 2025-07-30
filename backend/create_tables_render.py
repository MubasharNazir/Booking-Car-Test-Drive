#!/usr/bin/env python3
"""
Script to create database tables on Render deployment
Run this after setting up the PostgreSQL database
"""

import asyncio
import os
from app.db.models import Base
from app.db.session import engine

async def create_tables():
    """Create all database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    print("Creating database tables...")
    asyncio.run(create_tables()) 