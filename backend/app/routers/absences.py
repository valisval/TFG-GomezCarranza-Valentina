from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.absence import Absence, AbsenceStatus
from app.models.employee import Employee
from app.models.user import User
from app.schemas.absence import AbsenceCreate, AbsenceRead, AbsenceUpdate

router = APIRouter(prefix="/absences", tags=["Ausencias"])


@router.get("", response_model=list[AbsenceRead])
def list_absences(
    area: str | None = None,
    status_filter: AbsenceStatus | None = None,
    absence_type_id: int | None = None,
    employee_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    query = db.query(Absence).join(Employee)
    if area:
        query = query.filter(Employee.area == area)
    if status_filter:
        query = query.filter(Absence.status == status_filter)
    if absence_type_id:
        query = query.filter(Absence.absence_type_id == absence_type_id)
    if employee_id:
        query = query.filter(Absence.employee_id == employee_id)
    if start_date:
        query = query.filter(Absence.start_date >= start_date)
    if end_date:
        query = query.filter(Absence.end_date <= end_date)

    return query.order_by(Absence.start_date.desc()).all()


@router.post("", response_model=AbsenceRead, status_code=status.HTTP_201_CREATED)
def create_absence(
    payload: AbsenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")

    if payload.end_date < payload.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio",
        )

    absence = Absence(**payload.model_dump(), created_by_id=current_user.id)
    db.add(absence)
    db.commit()
    db.refresh(absence)
    return absence


@router.get("/{absence_id}", response_model=AbsenceRead)
def get_absence(
    absence_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    absence = db.query(Absence).filter(Absence.id == absence_id).first()
    if not absence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ausencia no encontrada")
    return absence


@router.put("/{absence_id}", response_model=AbsenceRead)
def update_absence(
    absence_id: int,
    payload: AbsenceUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    absence = db.query(Absence).filter(Absence.id == absence_id).first()
    if not absence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ausencia no encontrada")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(absence, field, value)

    db.commit()
    db.refresh(absence)
    return absence
