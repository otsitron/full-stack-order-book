import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const buttonVariants = {
  primary: "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white border-gray-700",
  ghost:
    "bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white border-gray-600",
  danger: "bg-red-500 hover:bg-red-600 text-white border-red-500",
};

const buttonSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded border transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
