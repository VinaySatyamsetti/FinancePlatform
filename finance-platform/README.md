# Finance Platform API

Enterprise-style starter for a personal finance and expense intelligence app using Python.

## Stack
- FastAPI
- React + Vite
- PostgreSQL + SQLAlchemy
- Alembic (dependency included; migration files can be added next)
- Redis + Celery (queue dependency baseline)
- Kafka (event streaming for domain events)
- JWT auth baseline

## Quick Start (Docker)
1. Copy `.env.example` to `.env` and update values.
2. Run: `docker compose up --build`
3. Open backend docs: `http://localhost:8000/docs`
4. Open frontend: `http://localhost:5173`

## Quick Start (Local)
1. Create virtual env and activate it.
2. Install: `pip install -e .[dev]`
3. Copy `.env.example` to `.env`
4. Run backend: `uvicorn app.main:app --reload`
5. Run frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Current Endpoints
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/token`
- `GET /api/v1/expenses`
- `POST /api/v1/expenses`

## Kafka Events
- Topic: `expense.created`
- Trigger: emitted after successful `POST /api/v1/expenses`
- Payload includes: `expense_id`, `user_id`, `amount`, `currency`, `category`, `merchant`, `expense_date`

## Next Build Steps
1. Add Alembic migrations and remove `create_all` bootstrap.
2. Add RBAC + organization (multi-tenant) model.
3. Add recurring expense detection job with Celery.
4. Add audit log middleware and reporting endpoints.
5. Add integration tests and CI pipeline.
