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
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {selectedSymbol === "BTC" ? "B" : "E"}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{selectedSymbol}-USD</h1>
          <p className="text-gray-400 text-sm">Perpetuals</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Symbol Selection */}
        <Select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value as "BTC" | "ETH")}
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </Select>

        {/* Precision Selection */}
        <Select
          value={precision}
          onChange={(e) => setPrecision(Number(e.target.value))}
        >
          <option value={0}>0 decimals</option>
          <option value={1}>1 decimal</option>
          <option value={2}>2 decimals</option>
          <option value={3}>3 decimals</option>
          <option value={4}>4 decimals</option>
        </Select>

        {/* Connection Status */}
        <StatusIndicator status={getConnectionStatus()} />

        <Button variant="secondary" size="sm">
          10x
        </Button>
        <Button variant="ghost" size="sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
