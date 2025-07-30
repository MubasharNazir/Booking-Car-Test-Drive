#!/bin/bash

# Set default port if not provided
PORT=${PORT:-8000}

echo "Starting server on port $PORT"

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT 