# Smart Car Platform Backend

This is the FastAPI backend for the Smart Car Platform, enabling AI-powered car search, dealership management, and real-time test drive booking.

## Architecture
- **FastAPI** (async Python web framework)
- **PostgreSQL** (with pgvector for semantic search)
- **Redis** (caching, sessions)
- **ML Integration** (Mistral 7B, Mini LLM embeddings)
- **Dockerized** for easy deployment

## Key Features
- JWT-based authentication
- Dealership and car inventory management
- AI-powered search and recommendations
- Real-time test drive booking
- ML endpoints for chat, price prediction, and more

## Technology Stack
- Python 3.11+, FastAPI, SQLAlchemy, Alembic, Pydantic
- PostgreSQL 15+, pgvector, Redis 7+
- transformers, sentence-transformers, torch, scikit-learn

## Development Setup

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. **Configure environment** (see `.env.example`)
4. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```
5. **Start the server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Docker
- Use `docker-compose up` for local development with PostgreSQL and Redis.

## API Docs
- Interactive docs at `/docs` when running locally.

---
For more details, see the code and comments in each module.
