from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.absence_type import AbsenceType
from app.schemas.absence import AbsenceTypeRead

router = APIRouter(prefix="/absence-types", tags=["Tipos de ausencia"])


@router.get("", response_model=list[AbsenceTypeRead])
def list_absence_types(db: Session = Depends(get_db), _current_user=Depends(get_current_user)):
    return db.query(AbsenceType).order_by(AbsenceType.name).all()
