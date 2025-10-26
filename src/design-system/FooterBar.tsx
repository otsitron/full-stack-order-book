import React from "react";

export interface FooterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function FooterBar({
  children,
  className = "",
  ...props
}: FooterBarProps) {
  return (
    <div
      className={`p-2 bg-gray-800/50 border-t border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
