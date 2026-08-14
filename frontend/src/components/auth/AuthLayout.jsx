import { Link } from "react-router-dom";

import { CheckIcon } from "../icons/CheckIcon.jsx";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Link to="/login" className="mb-6 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-800 text-white">
          <CheckIcon className="h-4 w-4" />
        </span>
        <span className="text-lg font-bold text-slate-900">AbsenceFlow</span>
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>

      {footer && <p className="mt-8 text-xs text-slate-400">{footer}</p>}
    </div>
  );
}
