import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/absences/new", label: "Registrar ausencia" },
  { to: "/validations", label: "Validaciones" },
  { to: "/reports", label: "Reportes" },
  { to: "/history", label: "Historial" },
  { to: "/profile", label: "Perfil" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white sm:block">
      <div className="px-6 py-5 text-lg font-semibold text-primary-700">AbsenceFlow</div>
      <nav className="flex flex-col gap-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
