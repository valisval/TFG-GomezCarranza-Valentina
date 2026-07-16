from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["Empleados"])


@router.get("", response_model=list[EmployeeRead])
def list_employees(
    area: str | None = None,
    is_active: bool | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    query = db.query(Employee)
    if area:
        query = query.filter(Employee.area == area)
    if is_active is not None:
        query = query.filter(Employee.is_active == is_active)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (Employee.first_name.ilike(like))
            | (Employee.last_name.ilike(like))
            | (Employee.legajo.ilike(like))
        )
    return query.order_by(Employee.last_name).all()


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    if db.query(Employee).filter(Employee.legajo == payload.legajo).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El legajo ya existe")

    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
    return employee


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee
