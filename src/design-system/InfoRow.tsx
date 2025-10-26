import React from "react";

export interface InfoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "minimal";
}

export default function InfoRow({
  children,
  variant = "default",
  className = "",
  ...props
}: InfoRowProps) {
  const variantClasses = {
    default: "bg-gray-600/30 p-2 text-xs border-y border-gray-600",
    highlight: "bg-gray-700/50 p-2 text-xs border-y border-orange-500/30",
    minimal: "p-2 text-xs",
  };

  return (
    <div
      className={`${variantClasses[variant]} flex items-center justify-center gap-2 text-gray-400 font-bold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
