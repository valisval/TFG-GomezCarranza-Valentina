from datetime import date

from pydantic import BaseModel, ConfigDict


class EmployeeBase(BaseModel):
    legajo: str
    first_name: str
    last_name: str
    email: str | None = None
    area: str
    position: str
    hire_date: date


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    area: str | None = None
    position: str | None = None
    is_active: bool | None = None


class EmployeeRead(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
