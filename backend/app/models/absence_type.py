from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AbsenceType(Base):
    """Tipos de ausencia: enfermedad, vacaciones, ART, licencia, etc."""

    __tablename__ = "absence_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    requires_certificate: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    absences: Mapped[list["Absence"]] = relationship(back_populates="absence_type")
