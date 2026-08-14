from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, RegisterRequest, Token
from app.schemas.user import UserRead

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contrasena incorrectos",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")

    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya esta registrado")

    role = db.query(Role).filter(Role.id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rol invalido")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/refresh", response_model=Token)
def refresh(current_user: User = Depends(get_current_user)):
    access_token = create_access_token(subject=current_user.email)
    return Token(access_token=access_token)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(payload: ForgotPasswordRequest):
    # Respuesta generica siempre (no revela si el email existe).
    # El envio real del correo con el link de reset queda pendiente: falta integrar un proveedor de email.
    return ForgotPasswordResponse(
        message="Si el email existe en el sistema, vas a recibir instrucciones para restablecer tu contrasena."
    )
