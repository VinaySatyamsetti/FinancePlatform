from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3, default="USD")
    category: str
    merchant: str
    expense_date: date
    note: str | None = None


class ExpenseRead(ExpenseCreate):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
