from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import absence_types, absences, auth, employees, reports, roles, users, validations

app = FastAPI(
    title=settings.APP_NAME,
    description="Sistema de gestion de ausentismo laboral para empresas del sector logistico-industrial.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(roles.router, prefix=settings.API_V1_PREFIX)
app.include_router(users.router, prefix=settings.API_V1_PREFIX)
app.include_router(employees.router, prefix=settings.API_V1_PREFIX)
app.include_router(absence_types.router, prefix=settings.API_V1_PREFIX)
app.include_router(absences.router, prefix=settings.API_V1_PREFIX)
app.include_router(validations.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}
