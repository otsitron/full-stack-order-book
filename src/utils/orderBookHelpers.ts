import { Order } from "@/contexts/OrderBookContext";
import {
  SIZE_VARIATION,
  SIZE_DECIMALS,
  MIN_SIZE,
  ORDER_SIZE_RANGE,
  TOTAL_DECIMALS,
  PRICE_DECIMALS,
} from "@/constants";

/**
 * Updates order sizes with random variation for demo/fallback mode.
 * This simulates market activity but is NOT real trading data.
 * Real trading sites would update from actual exchange order book streams.
 */
export const updateOrderSize = (orders: Order[]): Order[] => {
  let cumulative = 0;
  return orders.map((order) => {
    // NOTE: Math.random() used for fallback demo data only
    // Real trading sites would update from actual exchange order book streams
    const sizeChange = (Math.random() - 0.5) * SIZE_VARIATION;
    const newSize = Math.max(MIN_SIZE, order.size + sizeChange);
    cumulative += newSize;
    return {
      ...order,
      size: Number(newSize.toFixed(SIZE_DECIMALS)),
      total: Number((order.price * newSize).toFixed(TOTAL_DECIMALS)),
      cumulativeSize: Number(cumulative.toFixed(SIZE_DECIMALS)),
    };
  });
};

export const calculateCumulativeSizes = (orders: Order[]): Order[] => {
  let cumulative = 0;
  return orders.map((order) => {
    cumulative += order.size;
    return {
      ...order,
      cumulativeSize: cumulative,
    };
  });
};

export const calculateMaxSize = (asks: Order[], bids: Order[]): number => {
  const maxAskCumulative =
    asks.length > 0 ? Math.max(...asks.map((ask) => ask.cumulativeSize)) : 0;
  const maxBidCumulative =
    bids.length > 0 ? Math.max(...bids.map((bid) => bid.cumulativeSize)) : 0;
  return Math.max(maxAskCumulative, maxBidCumulative);
};

export const formatPrice = (price: number, precision: number): string => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

export const formatSize = (size: number): string => {
  return size.toFixed(4);
};

export const formatTotal = (total: number): string => {
  return total.toFixed(2);
};

export const getDepthBarWidth = (
  cumulativeSize: number,
  maxCumulativeSize: number
): number => {
  if (!maxCumulativeSize || maxCumulativeSize === 0) {
    return 0;
  }
  return (cumulativeSize / maxCumulativeSize) * 100;
};

export interface PriceChange {
  price: number;
  change: "up" | "down" | "none";
  timestamp: number;
}

export const getPriceChangeClass = (
  price: number,
  priceChanges: Map<number, PriceChange>
): string => {
  const change = priceChanges.get(price);
  if (!change) return "";

  switch (change.change) {
    case "up":
      return "animate-pulse bg-green-500/50";
    case "down":
      return "animate-pulse bg-red-500/50";
    default:
      return "";
  }
};

const ASK_COLORS = {
  bgColor: "bg-red-500/20",
  priceColor: "text-red-400",
  dataColor: "text-white",
};

const BID_COLORS = {
  bgColor: "bg-green-500/20",
  priceColor: "text-green-400",
  dataColor: "text-white",
};

export const getOrderColors = (type: "ask" | "bid") => {
  return type === "ask" ? ASK_COLORS : BID_COLORS;
};

/**
 * Generates grouped order book data at fixed price intervals.
 * NOTE: This uses Math.random() to simulate market data.
 * Real trading sites would receive actual order book data from exchange WebSockets.
 */
export const generateGroupedOrders = (
  basePrice: number,
  count: number,
  isBid: boolean,
  grouping: number
): Order[] => {
  const orders: Order[] = [];
  let cumulative = 0;

  for (let i = 0; i < count; i++) {
    const priceOffset = isBid ? -i * grouping : i * grouping;
    const price = basePrice + priceOffset;

    // NOTE: Math.random() used for fallback demo data only
    // Real trading sites would receive actual order data from exchange WebSocket
    const baseSize =
      ORDER_SIZE_RANGE.min +
      Math.random() * (ORDER_SIZE_RANGE.max - ORDER_SIZE_RANGE.min);
    const size = Number(baseSize.toFixed(SIZE_DECIMALS));
    const total = Number((price * size).toFixed(TOTAL_DECIMALS));

    cumulative += size;

    orders.push({
      price: Number(price.toFixed(PRICE_DECIMALS)),
      size,
      total,
      cumulativeSize: Number(cumulative.toFixed(SIZE_DECIMALS)),
    });
  }

  return orders;
};

/**
 * Processes Hyperliquid order book data format into my Order format.
 * Converts { price: string, sz: string }[] to Order[] with cumulative sizes.
 */
export const processHyperliquidOrders = (
  orders: Array<{ price: string; sz: string }>
): Order[] => {
  let cumulative = 0;
  return orders.map((order) => {
    const price = parseFloat(order.price);
    const size = parseFloat(order.sz);
    const total = price * size;
    cumulative += size;

    return {
      price,
      size,
      total,
      cumulativeSize: Number(cumulative.toFixed(SIZE_DECIMALS)),
    };
  });
};

/**
 * Calculates percentage values for bid/ask ratio visualization.
 * Returns percentages for both bid and ask volumes.
 */
export const calculateVolumeRatios = (
  bids: Order[],
  asks: Order[]
): { bidPercentage: number; askPercentage: number } => {
  const totalBidVolume = bids.reduce((sum, bid) => sum + bid.size, 0);
  const totalAskVolume = asks.reduce((sum, ask) => sum + ask.size, 0);
  const totalVolume = totalBidVolume + totalAskVolume;

  const bidPercentage =
    totalVolume > 0 ? (totalBidVolume / totalVolume) * 100 : 50;
  const askPercentage =
    totalVolume > 0 ? (totalAskVolume / totalVolume) * 100 : 50;

  return { bidPercentage, askPercentage };
};

/**
 * Calculates spread metrics: spread value, mid price, and spread percentage.
 */
export const calculateSpreadMetrics = (
  asks: Order[],
  bids: Order[],
  spreadGrouping: number
): { spread: number; midPrice: number; spreadPercentage: number } => {
  const spread = spreadGrouping;
  const midPrice = ((asks[0]?.price || 0) + (bids[0]?.price || 0)) / 2;
  const spreadPercentage = midPrice > 0 ? (spread / midPrice) * 100 : 0;

  return { spread, midPrice, spreadPercentage };
};
