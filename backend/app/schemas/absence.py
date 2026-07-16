from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.absence import AbsenceStatus
from app.schemas.employee import EmployeeRead


class AbsenceTypeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    requires_certificate: bool


class AbsenceBase(BaseModel):
    employee_id: int
    absence_type_id: int
    start_date: date
    end_date: date
    reason: str | None = None


class AbsenceCreate(AbsenceBase):
    pass


class AbsenceUpdate(BaseModel):
    absence_type_id: int | None = None
    start_date: date | None = None
    end_date: date | None = None
    reason: str | None = None
    status: AbsenceStatus | None = None


class AbsenceRead(AbsenceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: AbsenceStatus
    created_at: datetime
    employee: EmployeeRead
    absence_type: AbsenceTypeRead
