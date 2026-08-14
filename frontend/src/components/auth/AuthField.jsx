export default function AuthField({ label, id, rightElement, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
            rightElement ? "pr-10" : ""
          }`}
          {...inputProps}
        />
        {rightElement}
      </div>
    </div>
  );
}
