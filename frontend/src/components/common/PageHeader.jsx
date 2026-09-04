import React from "react";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
      {/* Title */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold leading-tight text-slate-800">{title}</h1>

        {subtitle && <p className="mt-0.5 truncate text-[11px] leading-tight text-slate-400">{subtitle}</p>}
      </div>

      {/* Actions */}
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
