FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy minimal requirements and install
COPY backend/requirements-minimal.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/app ./app

# Expose port
EXPOSE 8000

# Run the application with shell form to handle environment variables
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
