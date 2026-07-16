from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.role import RoleRead


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    role: RoleRead
