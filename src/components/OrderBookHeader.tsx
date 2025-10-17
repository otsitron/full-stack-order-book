"use client";

import React from "react";
import { useOrderBook } from "@/contexts";
import { Select, StatusIndicator, Button } from "@/design-system";

export default function OrderBookHeader() {
  const {
    selectedSymbol,
    precision,
    isConnected,
    useFallbackData,
    setSelectedSymbol,
    setPrecision,
  } = useOrderBook();

  const getConnectionStatus = () => {
    if (isConnected) return "connected";
    if (useFallbackData) return "demo";
    return "disconnected";
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">
            {selectedSymbol === "BTC" ? "B" : "E"}
          </span>
        </div>
        <div>
          <h1 className="text-sm font-semibold">{selectedSymbol}-USD</h1>
          <p className="text-gray-400 text-xs">Perpetuals</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Symbol Selection */}
        <Select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value as "BTC" | "ETH")}
          className="w-24 text-xs"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </Select>

        {/* Connection Status */}
        <StatusIndicator status={getConnectionStatus()} />
      </div>
    </div>
  );
}
