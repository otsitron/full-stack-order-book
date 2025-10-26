"use client";

import React from "react";
import { useOrderBook } from "@/contexts";
import { Select, StatusIndicator, Badge, HeaderBar } from "@/design-system";
import { SYMBOL_ICONS, SYMBOL_OPTIONS, SymbolType } from "@/constants";

export default function OrderBookHeader() {
  const { selectedSymbol, isConnected, useFallbackData, setSelectedSymbol } =
    useOrderBook();

  const getConnectionStatus = () => {
    if (isConnected) return "connected";
    if (useFallbackData) return "demo";
    return "disconnected";
  };

  return (
    <HeaderBar>
      <div className="flex items-center gap-2">
        <Badge className="bg-orange-500 text-white">
          {SYMBOL_ICONS[selectedSymbol]}
        </Badge>
        <div>
          <h1 className="text-sm font-semibold">{selectedSymbol}-USD</h1>
          <p className="text-gray-400 text-xs">Perpetuals</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          options={SYMBOL_OPTIONS}
          value={selectedSymbol}
          onChange={(value) => setSelectedSymbol(value as SymbolType)}
          className="w-24"
        />

        <StatusIndicator status={getConnectionStatus()} />
      </div>
    </HeaderBar>
  );
}
