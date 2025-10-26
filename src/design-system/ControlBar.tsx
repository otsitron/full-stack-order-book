import React from "react";

export interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "compact";
}

export default function ControlBar({
  children,
  variant = "default",
  className = "",
  ...props
}: ControlBarProps) {
  const baseClasses = "p-2 bg-gray-800 border-b border-gray-600";
  const variantClasses = variant === "compact" ? "gap-1" : "gap-4";

  return (
    <div
      className={`${baseClasses} ${variantClasses} flex flex-wrap items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
