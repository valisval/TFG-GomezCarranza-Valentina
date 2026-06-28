# TFG-GomezCarranza-Valentina

## 📋 Descripción

Este proyecto es una aplicación web desarrollada como trabajo final de grado (TFG) el cual centraliza el registro de ausencias, automatiza su clasificación y proporciona herramientas de análisis histórico para la toma de decisiones del área de Recursos Humanos.

---

## 🚀 Características Principales

- **Registro centralizado de ausencias** desde múltiples canales
- **Dashboard de indicadores** con KPIs en tiempo real: índice de ausentismo, validaciones pendientes, ausencias por área
- **Sistema de validaciones** con flujo de aprobación/rechazo y comentarios del validador
- **Módulo de reportes** con gráficos de evolución mensual y comparativo por área, exportables en CSV y PDF
- **Historial completo** con filtros por área, estado, tipo de ausencia y búsqueda por empleado o legajo
- **Análisis predictivo** basado en datos históricos para detección de patrones de ausentismo
- **Gestión de perfil de usuario** con control de sesiones y preferencias de notificación
- **Autenticación segura** con JWT y control de acceso por roles (HR Manager, Coordinador, Analista)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React
- **Backend**: Python, FastAPI
- **Base de Datos**: PostgreSQL
- **Autenticación**: Supabase Auth
- **Estilos**: Tailwind CSS
- **Despliegue**: Vercel

## 📖 Instalación Rápida

## ⚙️ Requisitos Previos

Antes de comenzar, asegurate de tener instalado:
- **Node.js** 18 o superior
- **npm** 9 o superior
- **Python** 3.11 o superior
- **PostgreSQL** 15 

---

## 📖 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/absenceflow.git
cd absenceflow
```

---

### 2. Configurar la base de datos (PostgreSQL)

```sql
-- Conectarse a PostgreSQL y ejecutar:
CREATE DATABASE absenceflow_db;
CREATE USER absenceflow_user WITH PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE absenceflow_db TO absenceflow_user;
```

---

### 3. Configurar y levantar el Backend (FastAPI)

```bash
# Ir al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus valores:

```env
# Base de datos
DATABASE_URL=postgresql://absenceflow_user:tu_password_segura@localhost:5432/absenceflow_db

# Seguridad JWT
SECRET_KEY=tu_clave_secreta_muy_larga_y_aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuración general
ENVIRONMENT=development
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

Ejecutar las migraciones:

```bash
alembic upgrade head
```

Iniciar el servidor de desarrollo:

```bash
uvicorn app.main:app --reload --port 8000
```

La API estará disponible en: `http://localhost:8000`  
Documentación interactiva (Swagger): `http://localhost:8000/docs`  
Documentación alternativa (ReDoc): `http://localhost:8000/redoc`

---

### 4. Configurar y levantar el Frontend (React)

```bash
# Desde la raíz del proyecto, ir al directorio del frontend
cd frontend

# Instalar dependencias
npm install
```

Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=AbsenceFlow
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🔌 API — Endpoints Principales

| Módulo | Método | Endpoint | Descripción |
|--------|--------|----------|-------------|
| **Auth** | POST | `/api/v1/auth/login` | Inicio de sesión |
| **Auth** | POST | `/api/v1/auth/register` | Registro de usuario |
| **Auth** | POST | `/api/v1/auth/refresh` | Renovar token JWT |
| **Ausencias** | GET | `/api/v1/absences` | Listar ausencias con filtros |
| **Ausencias** | POST | `/api/v1/absences` | Registrar nueva ausencia |
| **Ausencias** | GET | `/api/v1/absences/{id}` | Obtener detalle de ausencia |
| **Ausencias** | PUT | `/api/v1/absences/{id}` | Actualizar ausencia |
| **Validaciones** | GET | `/api/v1/validations` | Listar validaciones pendientes |
| **Validaciones** | PUT | `/api/v1/validations/{id}/approve` | Aprobar solicitud |
| **Validaciones** | PUT | `/api/v1/validations/{id}/reject` | Rechazar solicitud |
| **Reportes** | GET | `/api/v1/reports/summary` | Resumen general de KPIs |
| **Reportes** | GET | `/api/v1/reports/by-area` | Comparativo por área |
| **Reportes** | GET | `/api/v1/reports/evolution` | Evolución mensual |
| **Reportes** | GET | `/api/v1/reports/export/csv` | Exportar reporte en CSV |
| **Usuarios** | GET | `/api/v1/users/me` | Perfil del usuario autenticado |
| **Usuarios** | PUT | `/api/v1/users/me` | Actualizar perfil |

---

## 👤 Roles y Permisos

| Rol | Registrar ausencia | Validar | Ver reportes | Administrar usuarios |
|-----|:-----------------:|:-------:|:------------:|:-------------------:|
| **HR Manager** | ✅ | ✅ | ✅ | ✅ |
| **Coordinador** | ✅ | ✅ | ✅ | ❌ |
| **Analista** | ✅ | ❌ | ✅ | ❌ |

---

## 🧪 Ejecutar Tests

```bash
# Backend
cd backend
pytest tests/ -v

# Con reporte de cobertura
pytest tests/ --cov=app --cov-report=html
```

---

## 🚀 Despliegue en Producción

### Backend en Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto → "Deploy from GitHub repo"
3. Seleccionar el repositorio y la carpeta `/backend`
4. Agregar las variables de entorno de producción
5. Railway detecta automáticamente FastAPI y despliega con Uvicorn

### Base de datos en Railway

1. En el mismo proyecto de Railway → "Add Service" → "PostgreSQL"
2. Railway provee automáticamente la variable `DATABASE_URL`
3. Ejecutar migraciones: `alembic upgrade head`

### Frontend en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desde el directorio frontend
vercel --prod
```

---

## 📊 Modelo de datos — Tablas principales

```
employees          → Datos del personal
absences           → Registro de ausencias
absence_types      → Tipos de ausencia (enfermedad, vacaciones, ART, etc.)
validations        → Estado y historial de validación
users              → Usuarios del sistema (RRHH)
roles              → Roles y permisos
```

---

## 🔍 Ejemplos de uso de la API

### Autenticarse

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@absenceflow.com", "password": "password123"}'
```

### Registrar una ausencia

```bash
curl -X POST http://localhost:8000/api/v1/absences \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 42,
    "absence_type_id": 2,
    "start_date": "2025-10-12",
    "end_date": "2025-10-15",
    "reason": "Cuadro febril con reposo médico indicado"
  }'
```

### Obtener reporte por área

```bash
curl "http://localhost:8000/api/v1/reports/by-area?period=2025-10" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

---

## 🛡️ Seguridad

- Autenticación mediante **JWT (JSON Web Tokens)** con expiración configurable
- Contraseñas almacenadas con **bcrypt** (factor de costo 12)
- Validación estricta de datos de entrada con **Pydantic v2**
- Control de acceso basado en roles **(RBAC)**
- Comunicación cifrada mediante **HTTPS / SSL** en producción
- Variables sensibles gestionadas exclusivamente mediante **variables de entorno**

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos en el marco del Trabajo Final de la carrera de Ingeniería de Software.

---

## 👨‍💻 Contacto

**Valentina Gomez Carranza**  
📧 valentinag2203@gmail.com  
🔗 [github.com/valisval](https://github.com/valisval)

**Link del Proyecto:** [https://github.com/valisval/TFG-GomezCarranza-Valentina](https://github.com/valisval/TFG-GomezCarranza-Valentina)
