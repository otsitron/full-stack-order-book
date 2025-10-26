import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const badgeVariants = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  danger: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

const badgeSizes = {
  sm: "w-5 h-5 text-xs",
  md: "w-6 h-6 text-sm",
  lg: "w-8 h-8 text-base",
};

export default function Badge({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = badgeVariants[variant];
  const sizeClasses = badgeSizes[size];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
