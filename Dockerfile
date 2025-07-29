# FROM python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY ./app ./app

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${PORT:-8000}"]
FROM python:3.9-slim

WORKDIR /app

# Copy requirements from backend directory
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy the entire project
COPY . .

EXPOSE $PORT

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "$PORT"]