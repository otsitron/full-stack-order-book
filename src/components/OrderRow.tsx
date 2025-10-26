"use client";

import React, { memo } from "react";
import { Order } from "@/contexts";
import {
  formatPrice,
  formatSize,
  formatTotal,
  getDepthBarWidth,
  getOrderColors,
} from "@/utils/orderBookHelpers";

/**
 * OrderRow Component
 *
 * Renders individual order book rows with price, size, and total columns.
 * Displays cumulative depth bars with color-coded backgrounds (red for asks, green for bids).
 *
 * NOTE: Flash animation on row updates is intentionally not implemented.
 * In production trading interfaces, only a small subset of rows change per update,
 * allowing specific rows to flash for visual feedback. In my demo data, the fallback
 * update mechanism modifies virtually all rows simultaneously (see OrderBookProvider's
 * updateOrderSize function), which would cause the entire order book to flash continuously,
 * creating a distracting user experience rather than helpful visual feedback.
 */
interface OrderRowProps {
  order: Order;
  type: "ask" | "bid";
  maxCumulativeSize: number;
  precision: number;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  type,
  maxCumulativeSize,
  precision,
}) => {
  const { bgColor, priceColor, dataColor } = getOrderColors(type);

  return (
    <div className="relative group overflow-hidden">
      <div
        className={`absolute inset-0 ${bgColor} transition-all duration-300 ease-out`}
        style={{
          width: `${getDepthBarWidth(
            order.cumulativeSize,
            maxCumulativeSize
          )}%`,
        }}
      />
      <div className="relative grid grid-cols-3 gap-2 p-1 text-xs hover:bg-gray-700/50 transition-colors">
        <div className={priceColor}>{formatPrice(order.price, precision)}</div>
        <div className={dataColor}>{formatSize(order.size)}</div>
        <div className={dataColor}>{formatTotal(order.total)}</div>
      </div>
    </div>
  );
};

export default memo(OrderRow);
