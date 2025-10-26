import React from "react";
import ProgressBar from "./ProgressBar";

export interface RatioIndicatorProps {
  leftLabel: string;
  leftValue: number;
  leftColor?: string;
  rightLabel: string;
  rightValue: number;
  rightColor?: string;
  showPercentages?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export default function RatioIndicator({
  leftLabel,
  leftValue,
  leftColor = "text-green-400",
  rightLabel,
  rightValue,
  rightColor = "text-red-400",
  showPercentages = true,
  size = "sm",
  className = "",
}: RatioIndicatorProps) {
  const textSize = sizeConfig[size];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className={`flex items-center gap-1 ${textSize}`}>
        <span className={`${leftColor} font-medium`}>{leftLabel}</span>
        {showPercentages && (
          <span className={leftColor}>{leftValue.toFixed(0)}%</span>
        )}
      </div>

      <div className="flex-1 mx-3">
        <ProgressBar
          leftValue={leftValue}
          rightValue={rightValue}
          leftColor={
            leftColor.includes("green") ? "bg-green-500/60" : undefined
          }
          rightColor={rightColor.includes("red") ? "bg-red-500/60" : undefined}
          height={size}
        />
      </div>

      <div className={`flex items-center gap-1 ${textSize}`}>
        {showPercentages && (
          <span className={rightColor}>{rightValue.toFixed(0)}%</span>
        )}
        <span className={`${rightColor} font-medium`}>{rightLabel}</span>
      </div>
    </div>
  );
}
