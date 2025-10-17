import React from "react";

export interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "demo" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  connected: {
    color: "bg-green-500",
    label: "Connected",
  },
  disconnected: {
    color: "bg-red-500",
    label: "Disconnected",
  },
  demo: {
    color: "bg-yellow-500",
    label: "Demo Mode",
  },
  error: {
    color: "bg-red-500",
    label: "Error",
  },
};

const sizeConfig = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

export default function StatusIndicator({
  status,
  label,
  size = "md",
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;
  const sizeClasses = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses} rounded-full ${config.color}`} />
      <span className="text-xs text-gray-400 w-20 text-left">
        {displayLabel}
      </span>
    </div>
  );
}
