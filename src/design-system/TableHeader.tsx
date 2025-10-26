import React from "react";

export interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: string[];
  variant?: "default" | "minimal";
}

export default function TableHeader({
  columns,
  variant = "default",
  className = "",
  ...props
}: TableHeaderProps) {
  const baseClasses =
    variant === "default"
      ? "grid grid-cols-3 gap-2 p-2 bg-gray-700 text-xs font-medium"
      : "grid grid-cols-3 gap-2 p-2 text-xs font-semibold";

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {columns.map((column, index) => (
        <div key={index}>{column}</div>
      ))}
    </div>
  );
}
