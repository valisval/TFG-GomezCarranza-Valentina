from app.models.role import Role
from app.models.user import User
from app.core.security import hash_password


def _create_user(db_session, email="analista@absenceflow.com", password="password123"):
    role = Role(name="Analista", description="Analista de RRHH")
    db_session.add(role)
    db_session.commit()
    db_session.refresh(role)

    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name="Usuario de Prueba",
        role_id=role.id,
    )
    db_session.add(user)
    db_session.commit()
    return user


def test_login_success(client, db_session):
    _create_user(db_session)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "analista@absenceflow.com", "password": "password123"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials(client, db_session):
    _create_user(db_session)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "analista@absenceflow.com", "password": "contrasena_incorrecta"},
    )

    assert response.status_code == 401
