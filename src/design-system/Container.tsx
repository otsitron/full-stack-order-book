import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function Container({
  children,
  maxWidth = "sm",
  className = "",
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`w-full ${maxWidthClasses[maxWidth]} mx-auto bg-gray-900 text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
