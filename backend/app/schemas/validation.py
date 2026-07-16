from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.validation import ValidationStatus
from app.schemas.absence import AbsenceRead


class ValidationDecision(BaseModel):
    comment: str | None = None


class ValidationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: ValidationStatus
    comment: str | None = None
    validated_at: datetime
    absence: AbsenceRead
