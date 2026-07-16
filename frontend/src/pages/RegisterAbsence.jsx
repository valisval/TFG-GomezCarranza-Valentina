import { useEffect, useState } from "react";

import { listAbsenceTypes } from "../api/absenceTypes";
import { createAbsence } from "../api/absences";
import { listEmployees } from "../api/employees";

const initialForm = {
  employee_id: "",
  absence_type_id: "",
  start_date: "",
  end_date: "",
  reason: "",
};

export default function RegisterAbsence() {
  const [employees, setEmployees] = useState([]);
  const [absenceTypes, setAbsenceTypes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listEmployees({ is_active: true }).then(setEmployees).catch(() => {});
    listAbsenceTypes().then(setAbsenceTypes).catch(() => {});
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createAbsence({
        ...form,
        employee_id: Number(form.employee_id),
        absence_type_id: Number(form.absence_type_id),
      });
      setSuccess("Ausencia registrada correctamente");
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo registrar la ausencia");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Registrar ausencia</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Empleado</label>
          <select
            name="employee_id"
            required
            value={form.employee_id}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Seleccionar empleado</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.legajo} - {employee.first_name} {employee.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de ausencia</label>
          <select
            name="absence_type_id"
            required
            value={form.absence_type_id}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Seleccionar tipo</option>
            {absenceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha inicio</label>
            <input
              type="date"
              name="start_date"
              required
              value={form.start_date}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha fin</label>
            <input
              type="date"
              name="end_date"
              required
              value={form.end_date}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Motivo</label>
          <textarea
            name="reason"
            rows={3}
            value={form.reason}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Detalle del motivo de la ausencia"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : "Registrar ausencia"}
        </button>
      </form>
    </div>
  );
}
