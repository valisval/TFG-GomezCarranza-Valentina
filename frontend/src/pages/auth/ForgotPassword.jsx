import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { forgotPassword } from "../../api/auth";
import AuthField from "../../components/auth/AuthField.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ForgotPassword() {
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch {
      setError("No se pudo procesar la solicitud, intenta nuevamente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviaremos un link para restablecer tu contraseña."
    >
      {message ? (
        <div className="space-y-4">
          <p className="text-sm text-green-700">{message}</p>
          <Link to="/login" className="block text-center text-sm font-medium text-primary-700 hover:underline">
            ← Volver al inicio de sesion
          </Link>
        </div>
      ) : (
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary-900 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-60"
          >
            {submitting ? "Enviando..." : "Enviar instrucciones"}
          </button>

          <Link to="/login" className="block text-center text-sm font-medium text-primary-700 hover:underline">
            ← Volver al inicio de sesion
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
