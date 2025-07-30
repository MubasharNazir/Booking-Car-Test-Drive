#!/usr/bin/env python3
"""
Script to create database tables on Render
Run this to set up your database schema
"""

import asyncio
import os
import sys

# Add the app directory to Python path
sys.path.append('/app')

from app.db.models import Base
from app.db.session import engine

async def create_tables():
    """Create all database tables"""
    try:
        print("🔄 Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables created successfully!")
        print("📋 Created tables:")
        for table in Base.metadata.tables:
            print(f"   - {table}")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

if __name__ == "__main__":
    print("🚀 Starting database setup...")
    asyncio.run(create_tables())
    print("🎉 Database setup complete!") 