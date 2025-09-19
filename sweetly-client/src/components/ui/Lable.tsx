import React from "react";

export default function Label({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <label
      className={`block text-sm font-semibold text-slate-700 mb-2 ${className}`}
    >
      {children}
    </label>
  );
}
