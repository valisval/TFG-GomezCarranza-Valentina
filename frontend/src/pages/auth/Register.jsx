import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { register } from "../../api/auth";
import { listRoles } from "../../api/roles";
import AuthField from "../../components/auth/AuthField.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
  role_id: "",
};

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listRoles().then(setRoles).catch(() => {});
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role_id: Number(form.role_id),
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Completa tus datos para empezar">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Nombre completo"
          id="full_name"
          required
          value={form.full_name}
          onChange={handleChange}
          placeholder="Sarah Jenkins"
        />

        <AuthField
          label="Email"
          id="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="sarah@absenceflow.com"
        />

        <div className="grid grid-cols-2 gap-4">
          <AuthField
            label="Contraseña"
            id="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
          />
          <AuthField
            label="Confirmar"
            id="confirm_password"
            type="password"
            required
            value={form.confirm_password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="role_id" className="mb-1 block text-sm font-medium text-slate-700">
            Rol
          </label>
          <select
            id="role_id"
            name="role_id"
            required
            value={form.role_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Seleccionar rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary-900 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-60"
        >
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-center text-sm text-slate-500">
          ¿Ya tenes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary-700 hover:underline">
            Inicia sesion
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
