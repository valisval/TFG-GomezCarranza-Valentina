"""Carga de datos iniciales: roles y tipos de ausencia base.

Ejecutar con: python -m app.seed
"""

from app.database import Base, SessionLocal, engine
from app.models.absence_type import AbsenceType
from app.models.role import Role

ROLES = [
    {"name": "HR Manager", "description": "Administra usuarios, valida ausencias y accede a todos los reportes"},
    {"name": "Coordinador", "description": "Valida ausencias de su area y accede a reportes"},
    {"name": "Analista", "description": "Registra ausencias y consulta reportes"},
]

ABSENCE_TYPES = [
    {"code": "enfermedad", "name": "Enfermedad", "requires_certificate": True},
    {"code": "art", "name": "ART / Accidente laboral", "requires_certificate": True},
    {"code": "vacaciones", "name": "Vacaciones", "requires_certificate": False},
    {"code": "licencia", "name": "Licencia especial", "requires_certificate": False},
    {"code": "injustificada", "name": "Ausencia injustificada", "requires_certificate": False},
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in ROLES:
            if not db.query(Role).filter(Role.name == data["name"]).first():
                db.add(Role(**data))

        for data in ABSENCE_TYPES:
            if not db.query(AbsenceType).filter(AbsenceType.code == data["code"]).first():
                db.add(AbsenceType(**data))

        db.commit()
        print("Datos iniciales cargados correctamente.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
