from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.role import Role
from app.schemas.role import RoleRead

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("", response_model=list[RoleRead])
def list_roles(db: Session = Depends(get_db)):
    """Publico: se necesita para poblar el selector de rol en el registro."""
    return db.query(Role).order_by(Role.id).all()
