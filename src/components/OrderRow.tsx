"use client";

import { Order, PriceChange } from "@/contexts";

interface OrderRowProps {
  order: Order;
  index: number;
  type: "ask" | "bid";
  priceChanges: Map<number, PriceChange>;
  maxSize: number;
  precision: number;
}

export default function OrderRow({
  order,
  index,
  type,
  priceChanges,
  maxSize,
  precision,
}: OrderRowProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  };

  const formatSize = (size: number) => {
    return size.toFixed(4);
  };

  const formatTotal = (total: number) => {
    return total.toFixed(2);
  };

  const getDepthBarWidth = (size: number) => {
    return (size / maxSize) * 100;
  };

  const getPriceChangeClass = (price: number) => {
    const change = priceChanges.get(price);
    if (!change) return "";

    switch (change.change) {
      case "up":
        return "animate-pulse bg-green-500/20";
      case "down":
        return "animate-pulse bg-red-500/20";
      default:
        return "";
    }
  };

  const bgColor = type === "ask" ? "bg-red-900/20" : "bg-green-900/20";
  const textColor = type === "ask" ? "text-red-400" : "text-green-400";

  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 ${bgColor}`}
        style={{ width: `${getDepthBarWidth(order.size)}%` }}
      />
      <div
        className={`relative grid grid-cols-3 gap-4 p-3 text-sm hover:bg-gray-700/50 transition-colors ${getPriceChangeClass(
          order.price
        )}`}
      >
        <div className={textColor}>{formatPrice(order.price)}</div>
        <div className="text-white">{formatSize(order.size)}</div>
        <div className="text-white">{formatTotal(order.total)}</div>
      </div>
    </div>
  );
}
