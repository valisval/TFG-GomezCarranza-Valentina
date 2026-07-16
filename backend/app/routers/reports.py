import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.absence import Absence, AbsenceStatus
from app.models.employee import Employee
from app.models.user import User
from app.schemas.report import AreaReportItem, EvolutionReportItem, SummaryReport

router = APIRouter(prefix="/reports", tags=["Reportes"])


@router.get("/summary", response_model=SummaryReport)
def get_summary(db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    total_absences = db.query(func.count(Absence.id)).scalar() or 0
    pending_validations = (
        db.query(func.count(Absence.id)).filter(Absence.status == AbsenceStatus.PENDING).scalar() or 0
    )
    active_employees = db.query(func.count(Employee.id)).filter(Employee.is_active.is_(True)).scalar() or 0

    absenteeism_rate = round((total_absences / active_employees) * 100, 2) if active_employees else 0.0

    return SummaryReport(
        absenteeism_rate=absenteeism_rate,
        total_absences=total_absences,
        pending_validations=pending_validations,
        active_employees=active_employees,
    )


@router.get("/by-area", response_model=list[AreaReportItem])
def get_by_area(db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    rows = (
        db.query(Employee.area, func.count(Absence.id))
        .join(Absence, Absence.employee_id == Employee.id)
        .group_by(Employee.area)
        .all()
    )

    active_by_area = dict(
        db.query(Employee.area, func.count(Employee.id))
        .filter(Employee.is_active.is_(True))
        .group_by(Employee.area)
        .all()
    )

    result = []
    for area, total in rows:
        active = active_by_area.get(area, 0)
        rate = round((total / active) * 100, 2) if active else 0.0
        result.append(AreaReportItem(area=area, total_absences=total, absenteeism_rate=rate))
    return result


@router.get("/evolution", response_model=list[EvolutionReportItem])
def get_evolution(db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    period = func.to_char(Absence.start_date, "YYYY-MM")
    rows = db.query(period.label("period"), func.count(Absence.id)).group_by("period").order_by("period").all()
    return [EvolutionReportItem(period=row[0], total_absences=row[1]) for row in rows]


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    absences = db.query(Absence).join(Employee).order_by(Absence.start_date).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["legajo", "empleado", "area", "tipo", "inicio", "fin", "estado"])
    for absence in absences:
        writer.writerow(
            [
                absence.employee.legajo,
                f"{absence.employee.first_name} {absence.employee.last_name}",
                absence.employee.area,
                absence.absence_type.name,
                absence.start_date,
                absence.end_date,
                absence.status.value,
            ]
        )
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reporte_ausencias.csv"},
    )
