import logging

from fastapi import APIRouter, Depends, Header, HTTPException
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import db_dep
from app.core.config import settings
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseRead
from app.services.kafka_producer import publish_expense_created

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_current_user(authorization: str, db: Session) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email = payload.get("sub")
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("", response_model=list[ExpenseRead])
def list_expenses(
    db: Session = Depends(db_dep),
    authorization: str = Header(default=""),
) -> list[Expense]:
    user = _get_current_user(authorization, db)
    return db.execute(select(Expense).where(Expense.user_id == user.id)).scalars().all()


@router.post("", response_model=ExpenseRead, status_code=201)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(db_dep),
    authorization: str = Header(default=""),
) -> Expense:
    user = _get_current_user(authorization, db)
    expense = Expense(user_id=user.id, **payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    try:
        publish_expense_created(
            {
                "expense_id": expense.id,
                "user_id": expense.user_id,
                "amount": float(expense.amount),
                "currency": expense.currency,
                "category": expense.category,
                "merchant": expense.merchant,
                "expense_date": expense.expense_date.isoformat(),
            }
        )
    except Exception as exc:
        logger.warning("Failed to publish Kafka expense.created event: %s", exc)
    return expense
