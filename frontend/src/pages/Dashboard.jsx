import { useEffect, useState } from "react";

import { getSummary } from "../api/reports";

const KPI_CARDS = [
  { key: "absenteeism_rate", label: "Indice de ausentismo", suffix: "%" },
  { key: "total_absences", label: "Ausencias registradas", suffix: "" },
  { key: "pending_validations", label: "Validaciones pendientes", suffix: "" },
  { key: "active_employees", label: "Empleados activos", suffix: "" },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setError("No se pudieron cargar los indicadores"));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div key={card.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {summary ? `${summary[card.key]}${card.suffix}` : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
