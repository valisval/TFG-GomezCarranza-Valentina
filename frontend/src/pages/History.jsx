import { useEffect, useState } from "react";

import { listAbsences } from "../api/absences";

const STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const initialFilters = {
  area: "",
  status_filter: "",
  search: "",
};

export default function History() {
  const [absences, setAbsences] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState("");

  const loadAbsences = (activeFilters) => {
    const params = Object.fromEntries(
      Object.entries(activeFilters).filter(([, value]) => value)
    );
    listAbsences(params)
      .then(setAbsences)
      .catch(() => setError("No se pudo cargar el historial de ausencias"));
  };

  useEffect(() => {
    loadAbsences(initialFilters);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadAbsences(filters);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Historial de ausencias</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Area</label>
          <input
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Ej: Logistica"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
          <select
            name="status_filter"
            value={filters.status_filter}
            onChange={handleFilterChange}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="rejected">Rechazada</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Buscar empleado o legajo
          </label>
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Nombre o legajo"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Filtrar
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Empleado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Area</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Periodo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Estado</th>
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
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[absence.status]}`}
                  >
                    {STATUS_LABELS[absence.status]}
                  </span>
                </td>
              </tr>
            ))}
            {absences.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No se encontraron ausencias con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
