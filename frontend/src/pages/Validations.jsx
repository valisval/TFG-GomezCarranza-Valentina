import { useEffect, useState } from "react";

import { approveValidation, listPendingValidations, rejectValidation } from "../api/validations";

export default function Validations() {
  const [absences, setAbsences] = useState([]);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadPending = () => {
    listPendingValidations()
      .then(setAbsences)
      .catch(() => setError("No se pudieron cargar las validaciones pendientes"));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleDecision = async (absenceId, decide) => {
    setProcessingId(absenceId);
    setError("");
    try {
      await decide(absenceId);
      loadPending();
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo procesar la validacion");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Validaciones pendientes</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Empleado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Area</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Periodo</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {absences.map((absence) => (
              <tr key={absence.id}>
                <td className="px-4 py-3 text-gray-900">
                  {absence.employee.first_name} {absence.employee.last_name}
                </td>
                <td className="px-4 py-3 text-gray-500">{absence.employee.area}</td>
                <td className="px-4 py-3 text-gray-500">{absence.absence_type.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {absence.start_date} - {absence.end_date}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={processingId === absence.id}
                    onClick={() => handleDecision(absence.id, approveValidation)}
                    className="mr-2 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    Aprobar
                  </button>
                  <button
                    disabled={processingId === absence.id}
                    onClick={() => handleDecision(absence.id, rejectValidation)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
            {absences.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No hay validaciones pendientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
