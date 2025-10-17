"use client";

import React from "react";
import { useOrderBook } from "@/contexts";
import { Card } from "@/design-system";
import OrderRow from "./OrderRow";

export default function OrderBookTable() {
  const {
    asks,
    bids,
    maxSize,
    priceChanges,
    selectedSymbol,
    precision,
    spreadPercentage,
  } = useOrderBook();

  const formatSize = (size: number) => {
    return size.toFixed(4);
  };

  return (
    <Card variant="outlined" padding="none">
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-700 text-sm font-medium">
        <div>Price</div>
        <div>Size ({selectedSymbol})</div>
        <div>Total ({selectedSymbol})</div>
      </div>

      {/* Asks (Sell Orders) */}
      {asks.map((ask, index) => (
        <OrderRow
          key={`ask-${index}`}
          order={ask}
          index={index}
          type="ask"
          priceChanges={priceChanges}
          maxSize={maxSize}
          precision={precision}
        />
      ))}

      {/* Spread Row */}
      <div className="bg-gray-600/50 p-3 text-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-gray-300">Spread</div>
          <div className="text-white">{formatSize(asks[0]?.size || 0)}</div>
          <div className="text-white">{spreadPercentage.toFixed(2)}%</div>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      {bids.map((bid, index) => (
        <OrderRow
          key={`bid-${index}`}
          order={bid}
          index={index}
          type="bid"
          priceChanges={priceChanges}
          maxSize={maxSize}
          precision={precision}
        />
      ))}
    </Card>
  );
}
