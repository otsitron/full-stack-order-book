import React from "react";

export interface HeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "compact";
}

export default function HeaderBar({
  children,
  variant = "default",
  className = "",
  ...props
}: HeaderBarProps) {
  const baseClasses = "p-2 border-b border-gray-700";
  const variantClasses = variant === "compact" ? "gap-1" : "gap-2";

  return (
    <div
      className={`${baseClasses} ${variantClasses} flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
