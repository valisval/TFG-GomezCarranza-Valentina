import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ValidationStatus(str, enum.Enum):
    APPROVED = "approved"
    REJECTED = "rejected"


class Validation(Base):
    """Historial de validacion (aprobacion/rechazo) de una ausencia."""

    __tablename__ = "validations"

    id: Mapped[int] = mapped_column(primary_key=True)

    absence_id: Mapped[int] = mapped_column(ForeignKey("absences.id"), nullable=False)
    absence: Mapped["Absence"] = relationship(back_populates="validations")

    validator_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    validator: Mapped["User"] = relationship()

    status: Mapped[ValidationStatus] = mapped_column(Enum(ValidationStatus), nullable=False)
    comment: Mapped[str | None] = mapped_column(String(500), nullable=True)

    validated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
