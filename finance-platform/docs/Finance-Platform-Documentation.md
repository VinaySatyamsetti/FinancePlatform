# Finance Platform API - Project Documentation

## Project Objective
The objective of this project is to build an enterprise-grade personal finance backend that helps users securely track expenses, analyze spending behavior, and generate actionable financial insights.

This project is designed to simulate real-world enterprise engineering standards while solving a practical daily problem. The system should provide:
- Secure user authentication and data protection
- Reliable expense tracking and history
- Scalable API design for future analytics and automation features
- Auditability and maintainability for production-style operations

## Overview
Finance Platform API is an enterprise-style backend for personal finance and expense intelligence.

Current capabilities:
- User registration and login
- JWT authentication
- Expense create/list for authenticated users
- Health check endpoint
- Docker-based local setup (API + PostgreSQL + Redis)

Project root:
`c:\SF\VinayTest\finance-platform`

## Tech Stack
- Python 3.11+
- FastAPI
- React (Vite)
- SQLAlchemy
- PostgreSQL
- Alembic (dependency included)
- Redis + Celery (baseline)
- Kafka (event streaming)
- python-jose (JWT)
- passlib (bcrypt)
- pytest

## How Each Technology Supports the Objective
### Python 3.11+
Python enables rapid and clean backend development, allowing faster feature delivery and easier maintenance for long-term project growth.

### FastAPI
FastAPI provides high-performance API development, automatic OpenAPI documentation, and type-safe request/response validation. This supports a scalable and enterprise-friendly API layer.

### SQLAlchemy
SQLAlchemy provides robust ORM capabilities and database abstraction, helping maintain clean domain models, readable data access logic, and easier schema evolution.

### PostgreSQL
PostgreSQL offers reliable ACID transactions, indexing, and strong relational integrity. It is suitable for secure and consistent financial data storage.

### Alembic
Alembic supports versioned schema migrations, which is critical for controlled production deployments and safe database evolution.

### Redis + Celery
Redis and Celery enable asynchronous processing (for example, recurring expense detection, alerts, and report jobs), improving system responsiveness and scalability.

### Kafka
Kafka enables event-driven architecture by publishing domain events (for example `expense.created`) so downstream consumers can process analytics, notifications, or fraud checks without coupling to API request flow.

### python-jose (JWT)
python-jose is used for secure token creation and validation, enabling stateless authentication and secure API access control.

### passlib (bcrypt)
passlib with bcrypt ensures passwords are stored as secure hashes, reducing credential risk and aligning with security best practices.

### pytest
pytest enables reliable automated testing, which improves release confidence and helps prevent regressions as the platform grows.

## Folder Structure
- `app/main.py` - FastAPI bootstrap
- `app/core/config.py` - environment settings
- `app/core/security.py` - password hashing and token creation
- `app/db/session.py` - SQLAlchemy engine/session
- `app/db/base.py` - model metadata imports
- `app/models/` - User, Expense, AuditLog
- `app/schemas/` - Pydantic API schemas
- `app/api/v1/` - API routes (health, auth, expenses)
- `tests/test_health.py` - smoke test
- `frontend/` - React application (auth and expense UI)

## Configuration
Copy `.env.example` to `.env` and set:
- `APP_NAME`
- `ENV`
- `API_V1_PREFIX`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `DATABASE_URL`

Default docker DB URL:
`postgresql+psycopg://postgres:postgres@db:5432/finance_db`

## Data Models
### User
- id (PK)
- email (unique)
- hashed_password
- full_name
- is_active
- created_at

### Expense
- id (PK)
- user_id (FK -> users.id)
- amount
- currency (USD default)
- category
- merchant
- expense_date
- note (optional)
- created_at

### AuditLog
- id (PK)
- actor_email
- action
- resource
- created_at

## API Endpoints
Base path: `/api/v1`

### Health
- `GET /health`

### Auth
- `POST /auth/register`
- `POST /auth/token`

### Expenses (Bearer token required)
- `GET /expenses`
- `POST /expenses`

## Kafka Event Integration
- Broker: `kafka:9092` inside Docker network
- Topic: `expense.created`
- Producer location: `app/services/kafka_producer.py`
- Publish point: `POST /api/v1/expenses` after DB commit

## Run Guide
### Docker
1. `cd c:\SF\VinayTest\finance-platform`
2. Copy `.env.example` to `.env`
3. `docker compose up --build`
4. Open backend docs: `http://localhost:8000/docs`
5. Open frontend: `http://localhost:5173`

### Local
1. Create venv and activate
2. `pip install -e .[dev]`
3. Copy `.env.example` to `.env`
4. `uvicorn app.main:app --reload`
5. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Testing
Run:
`pytest`

## Current Gaps
- Alembic migrations not initialized yet
- RBAC and multi-tenant logic pending
- Audit logging hooks pending
- Auth dependency can be refactored into reusable module

## Next Steps
1. Add Alembic migration setup
2. Add OAuth2PasswordBearer + reusable `get_current_user`
3. Add audit middleware
4. Add update/delete expense APIs
5. Add integration tests and CI pipeline
