import React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export default function Select({
  label,
  error,
  className = "",
  children,
  ...props
}: SelectProps) {
  const baseClasses =
    "bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500";
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-gray-400 font-medium">{label}</label>
      )}
      <select
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
