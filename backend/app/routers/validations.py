from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models.absence import Absence, AbsenceStatus
from app.models.user import User
from app.models.validation import Validation, ValidationStatus
from app.schemas.absence import AbsenceRead
from app.schemas.validation import ValidationDecision, ValidationRead

router = APIRouter(prefix="/validations", tags=["Validaciones"])

VALIDATOR_ROLES = ("HR Manager", "Coordinador")


@router.get("", response_model=list[AbsenceRead])
def list_pending_validations(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    return (
        db.query(Absence)
        .filter(Absence.status == AbsenceStatus.PENDING)
        .order_by(Absence.start_date)
        .all()
    )


def _resolve_validation(
    absence_id: int,
    decision: ValidationStatus,
    payload: ValidationDecision,
    db: Session,
    current_user: User,
) -> Validation:
    absence = db.query(Absence).filter(Absence.id == absence_id).first()
    if not absence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ausencia no encontrada")
    if absence.status != AbsenceStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La ausencia ya fue validada")

    absence.status = (
        AbsenceStatus.APPROVED if decision == ValidationStatus.APPROVED else AbsenceStatus.REJECTED
    )

    validation = Validation(
        absence_id=absence.id,
        validator_id=current_user.id,
        status=decision,
        comment=payload.comment,
    )
    db.add(validation)
    db.commit()
    db.refresh(validation)
    return validation


@router.put("/{absence_id}/approve", response_model=ValidationRead)
def approve_validation(
    absence_id: int,
    payload: ValidationDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*VALIDATOR_ROLES)),
):
    return _resolve_validation(absence_id, ValidationStatus.APPROVED, payload, db, current_user)


@router.put("/{absence_id}/reject", response_model=ValidationRead)
def reject_validation(
    absence_id: int,
    payload: ValidationDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*VALIDATOR_ROLES)),
):
    return _resolve_validation(absence_id, ValidationStatus.REJECTED, payload, db, current_user)
