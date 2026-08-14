import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import AuthField from "../../components/auth/AuthField.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { EyeIcon, EyeOffIcon } from "../../components/icons/EyeIcon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo iniciar sesion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Inicia sesion"
      subtitle="Ingresa tus credenciales para continuar"
      footer="AbsenceFlow Logistics Platform © 2025"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email"
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="m@admin.com"
        />

        <div>
          <AuthField
            label="Contraseña"
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-1.5 text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-primary-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary-900 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-60"
        >
          {submitting ? "Ingresando..." : "Ingresar al sistema"}
        </button>

        <p className="text-center text-sm text-slate-500">
          ¿No tenes cuenta?{" "}
          <Link to="/register" className="font-semibold text-primary-700 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
