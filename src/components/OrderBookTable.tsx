"use client";

import React from "react";
import { useOrderBook } from "@/contexts";
import { Card } from "@/design-system";
import OrderRow from "./OrderRow";
import BidAskRatio from "./BidAskRatio";

export default function OrderBookTable() {
  const {
    asks,
    bids,
    maxSize,
    priceChanges,
    selectedSymbol,
    precision,
    spread,
    spreadPercentage,
  } = useOrderBook();

  console.log(
    "OrderBookTable render - asks:",
    asks.length,
    "bids:",
    bids.length
  );

  const formatSize = (size: number) => {
    return size.toFixed(4);
  };

  return (
    <Card variant="outlined" padding="none">
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-gray-700 text-xs font-medium">
        <div>Price</div>
        <div>Size ({selectedSymbol})</div>
        <div>Total ({selectedSymbol})</div>
      </div>

      {/* Asks (Sell Orders) - Reverse display order so lowest ask is closest to spread */}
      {asks
        .slice()
        .reverse()
        .map((ask, index) => (
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
      <div className="bg-gray-600/30 p-2 text-xs border-y border-gray-600">
        <div className="flex items-center justify-between">
          {/* Last Price */}
          <div className="flex items-center gap-1">
            <span className="text-green-400">↑</span>
            <span className="text-green-400 font-medium">
              {asks[0]?.price?.toLocaleString("en-US", {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision,
              }) || "0.00"}
            </span>
          </div>

          {/* Spread Info */}
          <div className="flex items-center gap-2 text-gray-400">
            <span>Spread</span>
            <span className="text-white">{spread.toFixed(precision)}</span>
            <span>({spreadPercentage.toFixed(3)}%)</span>
          </div>

          {/* Mark Price */}
          <div className="flex items-center gap-1">
            <span className="text-orange-400">🚩</span>
            <span className="text-orange-400 font-medium">
              {bids[0]?.price?.toLocaleString("en-US", {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision,
              }) || "0.00"}
            </span>
          </div>
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

      {/* Bid-Ask Ratio Indicator */}
      <BidAskRatio />
    </Card>
  );
}
