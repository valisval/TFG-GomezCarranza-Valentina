import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { exportCsv, getByArea, getEvolution } from "../api/reports";

export default function Reports() {
  const [byArea, setByArea] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([getByArea(), getEvolution()])
      .then(([areaData, evolutionData]) => {
        setByArea(areaData);
        setEvolution(evolutionData);
      })
      .catch(() => setError("No se pudieron cargar los reportes"));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte_ausencias.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo exportar el reporte");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {exporting ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-700">Evolucion mensual</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total_absences" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-700">Comparativo por area</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byArea}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total_absences" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
