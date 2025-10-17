"use client";

import React from "react";
import { useOrderBook } from "@/contexts";

export default function BidAskRatio() {
  const { bidPercentage, askPercentage, selectedSymbol } = useOrderBook();

  return (
    <div className="p-2 bg-gray-800/50 border-t border-gray-700">
      <div className="flex items-center justify-between text-xs">
        {/* Bid Percentage */}
        <div className="flex items-center gap-1">
          <span className="text-green-400 font-medium">B</span>
          <span className="text-green-400">{bidPercentage.toFixed(0)}%</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="flex-1 mx-3">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-500/60 transition-all duration-300"
                style={{ width: `${bidPercentage}%` }}
              />
              <div
                className="bg-red-500/60 transition-all duration-300"
                style={{ width: `${askPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ask Percentage */}
        <div className="flex items-center gap-1">
          <span className="text-red-400">{askPercentage.toFixed(0)}%</span>
          <span className="text-red-400 font-medium">S</span>
        </div>
      </div>
    </div>
  );
}
