import React from "react";

export interface ProgressBarProps {
  leftValue: number;
  rightValue: number;
  leftColor?: string;
  rightColor?: string;
  height?: "sm" | "md" | "lg";
  className?: string;
}

const heightConfig = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export default function ProgressBar({
  leftValue,
  rightValue,
  leftColor = "bg-green-500/60",
  rightColor = "bg-red-500/60",
  height = "md",
  className = "",
}: ProgressBarProps) {
  const total = leftValue + rightValue;
  const leftPercentage = total > 0 ? (leftValue / total) * 100 : 0;
  const rightPercentage = total > 0 ? (rightValue / total) * 100 : 0;

  return (
    <div
      className={`${heightConfig[height]} bg-gray-700 rounded-full overflow-hidden ${className}`}
    >
      <div className="h-full flex">
        <div
          className={`${leftColor} transition-all duration-300`}
          style={{ width: `${leftPercentage}%` }}
        />
        <div
          className={`${rightColor} transition-all duration-300`}
          style={{ width: `${rightPercentage}%` }}
        />
      </div>
    </div>
  );
}
