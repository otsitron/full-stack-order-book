import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const cardVariants = {
  default: "bg-gray-800",
  elevated: "bg-gray-800 shadow-lg",
  outlined: "bg-gray-800 border border-gray-700",
};

const cardPadding = {
  none: "",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses = "rounded-lg";
  const variantClasses = cardVariants[variant];
  const paddingClasses = cardPadding[padding];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
