from pydantic import BaseModel


class SummaryReport(BaseModel):
    absenteeism_rate: float
    total_absences: int
    pending_validations: int
    active_employees: int


class AreaReportItem(BaseModel):
    area: str
    total_absences: int
    absenteeism_rate: float


class EvolutionReportItem(BaseModel):
    period: str
    total_absences: int
