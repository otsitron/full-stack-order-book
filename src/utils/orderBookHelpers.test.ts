import { describe, it, expect } from "vitest";
import { Order } from "@/contexts/OrderBookContext";
import {
  updateOrderSize,
  calculateCumulativeSizes,
  calculateMaxSize,
  formatPrice,
  formatSize,
  formatTotal,
  getDepthBarWidth,
  getPriceChangeClass,
  getOrderColors,
  generateGroupedOrders,
  processHyperliquidOrders,
  calculateVolumeRatios,
  calculateSpreadMetrics,
  PriceChange,
} from "./orderBookHelpers";

describe("orderBookHelpers", () => {
  const mockOrder: Order = {
    price: 50000,
    size: 1.5,
    total: 75000,
    cumulativeSize: 0,
  };

  describe("calculateCumulativeSizes", () => {
    it("should calculate cumulative sizes correctly", () => {
      const orders: Order[] = [
        { ...mockOrder, size: 1.0 },
        { ...mockOrder, size: 2.0 },
        { ...mockOrder, size: 1.5 },
      ];

      const result = calculateCumulativeSizes(orders);

      expect(result[0].cumulativeSize).toBe(1.0);
      expect(result[1].cumulativeSize).toBe(3.0);
      expect(result[2].cumulativeSize).toBe(4.5);
    });

    it("should handle empty array", () => {
      const result = calculateCumulativeSizes([]);
      expect(result).toEqual([]);
    });

    it("should handle single order", () => {
      const result = calculateCumulativeSizes([{ ...mockOrder, size: 5.0 }]);
      expect(result[0].cumulativeSize).toBe(5.0);
    });

    it("should preserve other order properties", () => {
      const orders: Order[] = [
        { ...mockOrder, price: 50000, size: 1.0 },
        { ...mockOrder, price: 50001, size: 2.0 },
      ];

      const result = calculateCumulativeSizes(orders);

      expect(result[0].price).toBe(50000);
      expect(result[1].price).toBe(50001);
      expect(result[0].size).toBe(1.0);
      expect(result[1].size).toBe(2.0);
    });
  });

  describe("calculateMaxSize", () => {
    it("should return the maximum cumulative size from asks and bids", () => {
      const asks: Order[] = [
        { ...mockOrder, cumulativeSize: 10.0 },
        { ...mockOrder, cumulativeSize: 15.0 },
      ];
      const bids: Order[] = [
        { ...mockOrder, cumulativeSize: 8.0 },
        { ...mockOrder, cumulativeSize: 12.0 },
      ];

      const result = calculateMaxSize(asks, bids);
      expect(result).toBe(15.0);
    });

    it("should handle empty asks array", () => {
      const asks: Order[] = [];
      const bids: Order[] = [
        { ...mockOrder, cumulativeSize: 10.0 },
        { ...mockOrder, cumulativeSize: 15.0 },
      ];

      const result = calculateMaxSize(asks, bids);
      expect(result).toBe(15.0);
    });

    it("should handle empty bids array", () => {
      const asks: Order[] = [
        { ...mockOrder, cumulativeSize: 10.0 },
        { ...mockOrder, cumulativeSize: 15.0 },
      ];
      const bids: Order[] = [];

      const result = calculateMaxSize(asks, bids);
      expect(result).toBe(15.0);
    });

    it("should handle both arrays empty", () => {
      const result = calculateMaxSize([], []);
      expect(result).toBe(0);
    });

    it("should work when asks have larger cumulative size", () => {
      const asks: Order[] = [{ ...mockOrder, cumulativeSize: 100.0 }];
      const bids: Order[] = [{ ...mockOrder, cumulativeSize: 50.0 }];

      const result = calculateMaxSize(asks, bids);
      expect(result).toBe(100.0);
    });

    it("should work when bids have larger cumulative size", () => {
      const asks: Order[] = [{ ...mockOrder, cumulativeSize: 30.0 }];
      const bids: Order[] = [{ ...mockOrder, cumulativeSize: 80.0 }];

      const result = calculateMaxSize(asks, bids);
      expect(result).toBe(80.0);
    });
  });

  describe("updateOrderSize", () => {
    it("should update order sizes and recalculate cumulative sizes", () => {
      const orders: Order[] = [
        { ...mockOrder, price: 50000, size: 1.0, cumulativeSize: 0 },
        { ...mockOrder, price: 50001, size: 2.0, cumulativeSize: 0 },
      ];

      // Mock Math.random to return a fixed value for testing
      const originalRandom = Math.random;
      Math.random = () => 0.5;

      const result = updateOrderSize(orders);

      // Reset Math.random
      Math.random = originalRandom;

      expect(result).toHaveLength(2);
      expect(result[0].size).toBeCloseTo(1.0, 1);
      expect(result[1].size).toBeCloseTo(2.0, 1);
      expect(result[0].cumulativeSize).toBeCloseTo(result[0].size, 1);
      expect(result[1].cumulativeSize).toBeGreaterThan(
        result[0].cumulativeSize
      );
    });

    it("should recalculate totals based on new sizes", () => {
      const orders: Order[] = [
        { ...mockOrder, price: 50000, size: 1.0, total: 0 },
      ];

      const originalRandom = Math.random;
      Math.random = () => 0.5;

      const result = updateOrderSize(orders);

      Math.random = originalRandom;

      expect(result[0].total).toBeCloseTo(result[0].price * result[0].size, 2);
    });

    it("should not allow sizes below MIN_SIZE", () => {
      const orders: Order[] = [{ ...mockOrder, size: 0.05 }];

      const originalRandom = Math.random;
      Math.random = () => 0; // This would subtract SIZE_VARIATION

      const result = updateOrderSize(orders);

      Math.random = originalRandom;

      expect(result[0].size).toBeGreaterThanOrEqual(0.1);
    });

    it("should handle empty array", () => {
      const result = updateOrderSize([]);
      expect(result).toEqual([]);
    });

    it("should preserve order properties except size, total, and cumulativeSize", () => {
      const orders: Order[] = [{ ...mockOrder, price: 50000, size: 1.0 }];

      const result = updateOrderSize(orders);

      expect(result[0].price).toBe(50000);
    });
  });

  describe("formatPrice", () => {
    it("should format price with correct precision", () => {
      expect(formatPrice(50000, 2)).toBe("50,000.00");
      expect(formatPrice(3000.5, 1)).toBe("3,000.5");
      expect(formatPrice(100, 0)).toBe("100");
    });

    it("should handle very large numbers", () => {
      const result = formatPrice(1000000, 2);
      expect(result).toContain("1,000,000");
    });

    it("should handle very small numbers", () => {
      expect(formatPrice(0.01, 2)).toBe("0.01");
    });
  });

  describe("formatSize", () => {
    it("should format size to 4 decimal places", () => {
      expect(formatSize(1.5)).toBe("1.5000");
      expect(formatSize(2.12345)).toBe("2.1235");
      expect(formatSize(0.1)).toBe("0.1000");
    });

    it("should handle zero", () => {
      expect(formatSize(0)).toBe("0.0000");
    });
  });

  describe("formatTotal", () => {
    it("should format total to 2 decimal places", () => {
      expect(formatTotal(75000)).toBe("75000.00");
      expect(formatTotal(123.456)).toBe("123.46");
      expect(formatTotal(0.5)).toBe("0.50");
    });

    it("should handle zero", () => {
      expect(formatTotal(0)).toBe("0.00");
    });
  });

  describe("getDepthBarWidth", () => {
    it("should calculate correct percentage", () => {
      expect(getDepthBarWidth(50, 100)).toBe(50);
      expect(getDepthBarWidth(25, 100)).toBe(25);
      expect(getDepthBarWidth(75, 100)).toBe(75);
    });

    it("should return 0 when maxCumulativeSize is 0", () => {
      expect(getDepthBarWidth(50, 0)).toBe(0);
    });

    it("should return 0 when maxCumulativeSize is undefined", () => {
      expect(getDepthBarWidth(50, undefined as unknown as number)).toBe(0);
    });

    it("should handle 100% case", () => {
      expect(getDepthBarWidth(100, 100)).toBe(100);
    });

    it("should handle smaller cumulative sizes", () => {
      expect(getDepthBarWidth(10, 1000)).toBe(1);
    });
  });

  describe("getPriceChangeClass", () => {
    it("should return green pulse class for up change", () => {
      const priceChanges = new Map<number, PriceChange>();
      priceChanges.set(50000, {
        price: 50000,
        change: "up",
        timestamp: Date.now(),
      });

      const result = getPriceChangeClass(50000, priceChanges);
      expect(result).toBe("animate-pulse bg-green-500/50");
    });

    it("should return red pulse class for down change", () => {
      const priceChanges = new Map<number, PriceChange>();
      priceChanges.set(50000, {
        price: 50000,
        change: "down",
        timestamp: Date.now(),
      });

      const result = getPriceChangeClass(50000, priceChanges);
      expect(result).toBe("animate-pulse bg-red-500/50");
    });

    it("should return empty string when no change", () => {
      const priceChanges = new Map<number, PriceChange>();
      priceChanges.set(50000, {
        price: 50000,
        change: "none",
        timestamp: Date.now(),
      });

      const result = getPriceChangeClass(50000, priceChanges);
      expect(result).toBe("");
    });

    it("should return empty string when price not found", () => {
      const priceChanges = new Map<number, PriceChange>();
      const result = getPriceChangeClass(50000, priceChanges);
      expect(result).toBe("");
    });
  });

  describe("getOrderColors", () => {
    it("should return red colors for ask orders", () => {
      const result = getOrderColors("ask");
      expect(result.bgColor).toBe("bg-red-500/20");
      expect(result.priceColor).toBe("text-red-400");
      expect(result.dataColor).toBe("text-white");
    });

    it("should return green colors for bid orders", () => {
      const result = getOrderColors("bid");
      expect(result.bgColor).toBe("bg-green-500/20");
      expect(result.priceColor).toBe("text-green-400");
      expect(result.dataColor).toBe("text-white");
    });
  });

  describe("generateGroupedOrders", () => {
    it("should generate the correct number of orders", () => {
      const result = generateGroupedOrders(50000, 5, false, 10);
      expect(result).toHaveLength(5);
    });

    it("should generate ask orders with ascending prices", () => {
      const result = generateGroupedOrders(50000, 5, false, 10);
      expect(result[0].price).toBeLessThan(result[1].price);
      expect(result[1].price).toBeLessThan(result[2].price);
      expect(result[2].price).toBeLessThan(result[3].price);
    });

    it("should generate bid orders with descending prices", () => {
      const result = generateGroupedOrders(50000, 5, true, 10);
      expect(result[0].price).toBeGreaterThan(result[1].price);
      expect(result[1].price).toBeGreaterThan(result[2].price);
      expect(result[2].price).toBeGreaterThan(result[3].price);
    });

    it("should respect the grouping parameter for price intervals", () => {
      const result = generateGroupedOrders(50000, 3, false, 100);
      expect(result[1].price - result[0].price).toBeCloseTo(100, 2);
      expect(result[2].price - result[1].price).toBeCloseTo(100, 2);
    });

    it("should calculate cumulative sizes correctly", () => {
      const result = generateGroupedOrders(50000, 3, false, 10);
      expect(result[0].cumulativeSize).toBeGreaterThan(0);
      expect(result[1].cumulativeSize).toBeGreaterThan(
        result[0].cumulativeSize
      );
      expect(result[2].cumulativeSize).toBeGreaterThan(
        result[1].cumulativeSize
      );
    });

    it("should calculate total as price * size", () => {
      const result = generateGroupedOrders(50000, 3, false, 10);
      result.forEach((order) => {
        expect(order.total).toBeCloseTo(order.price * order.size, 2);
      });
    });

    it("should have sizes within ORDER_SIZE_RANGE", () => {
      const result = generateGroupedOrders(50000, 10, false, 10);
      result.forEach((order) => {
        expect(order.size).toBeGreaterThanOrEqual(0.1);
        expect(order.size).toBeLessThanOrEqual(2.5);
      });
    });
  });

  describe("processHyperliquidOrders", () => {
    it("should convert Hyperliquid format to Order format", () => {
      const hyperliquidData = [
        { price: "50000.5", sz: "1.5" },
        { price: "50001.5", sz: "2.0" },
        { price: "50002.5", sz: "1.0" },
      ];

      const result = processHyperliquidOrders(hyperliquidData);

      expect(result).toHaveLength(3);
      expect(result[0].price).toBe(50000.5);
      expect(result[0].size).toBe(1.5);
      expect(result[0].total).toBe(75000.75);
    });

    it("should calculate cumulative sizes correctly", () => {
      const hyperliquidData = [
        { price: "50000", sz: "1.0" },
        { price: "50001", sz: "2.0" },
        { price: "50002", sz: "1.5" },
      ];

      const result = processHyperliquidOrders(hyperliquidData);

      expect(result[0].cumulativeSize).toBeCloseTo(1.0, 4);
      expect(result[1].cumulativeSize).toBeCloseTo(3.0, 4);
      expect(result[2].cumulativeSize).toBeCloseTo(4.5, 4);
    });

    it("should handle empty array", () => {
      const result = processHyperliquidOrders([]);
      expect(result).toEqual([]);
    });

    it("should handle single order", () => {
      const result = processHyperliquidOrders([{ price: "50000", sz: "2.5" }]);

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(50000);
      expect(result[0].size).toBe(2.5);
      expect(result[0].total).toBe(125000);
      expect(result[0].cumulativeSize).toBeCloseTo(2.5, 4);
    });

    it("should round cumulative sizes to 4 decimal places", () => {
      const hyperliquidData = [{ price: "50000", sz: "1.23456" }];

      const result = processHyperliquidOrders(hyperliquidData);

      expect(result[0].cumulativeSize.toString()).toMatch(/^\d+\.\d{1,4}$/);
    });
  });

  describe("calculateVolumeRatios", () => {
    it("should calculate correct percentages for bid and ask volumes", () => {
      const bids: Order[] = [
        { price: 50000, size: 2.0, total: 100000, cumulativeSize: 2.0 },
        { price: 49999, size: 1.0, total: 49999, cumulativeSize: 3.0 },
      ];
      const asks: Order[] = [
        { price: 50001, size: 3.0, total: 150003, cumulativeSize: 3.0 },
        { price: 50002, size: 1.0, total: 50002, cumulativeSize: 4.0 },
      ];

      const result = calculateVolumeRatios(bids, asks);

      // Total volume: 2.0 + 1.0 + 3.0 + 1.0 = 7.0
      // Bid: 3.0 / 7.0 = 42.857...
      // Ask: 4.0 / 7.0 = 57.142...
      expect(result.bidPercentage).toBeCloseTo(42.857, 1);
      expect(result.askPercentage).toBeCloseTo(57.142, 1);
    });

    it("should return 50-50 when volumes are equal", () => {
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];
      const asks: Order[] = [
        { price: 50001, size: 1.0, total: 50001, cumulativeSize: 1.0 },
      ];

      const result = calculateVolumeRatios(bids, asks);

      expect(result.bidPercentage).toBe(50);
      expect(result.askPercentage).toBe(50);
    });

    it("should return 50-50 when total volume is zero", () => {
      const result = calculateVolumeRatios([], []);
      expect(result.bidPercentage).toBe(50);
      expect(result.askPercentage).toBe(50);
    });

    it("should return 100-0 when only bids exist", () => {
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateVolumeRatios(bids, []);

      expect(result.bidPercentage).toBe(100);
      expect(result.askPercentage).toBe(0);
    });

    it("should return 0-100 when only asks exist", () => {
      const asks: Order[] = [
        { price: 50001, size: 1.0, total: 50001, cumulativeSize: 1.0 },
      ];

      const result = calculateVolumeRatios([], asks);

      expect(result.bidPercentage).toBe(0);
      expect(result.askPercentage).toBe(100);
    });

    it("should handle small volumes correctly", () => {
      const bids: Order[] = [
        { price: 50000, size: 0.1, total: 5000, cumulativeSize: 0.1 },
      ];
      const asks: Order[] = [
        { price: 50001, size: 0.9, total: 45009, cumulativeSize: 0.9 },
      ];

      const result = calculateVolumeRatios(bids, asks);

      expect(result.bidPercentage).toBe(10);
      expect(result.askPercentage).toBe(90);
    });
  });

  describe("calculateSpreadMetrics", () => {
    it("should calculate spread correctly", () => {
      const asks: Order[] = [
        { price: 50010, size: 1.0, total: 50010, cumulativeSize: 1.0 },
      ];
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics(asks, bids, 10);

      expect(result.spread).toBe(10);
    });

    it("should calculate mid price correctly", () => {
      const asks: Order[] = [
        { price: 50010, size: 1.0, total: 50010, cumulativeSize: 1.0 },
      ];
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics(asks, bids, 10);

      expect(result.midPrice).toBe(50005);
    });

    it("should calculate spread percentage correctly", () => {
      const asks: Order[] = [
        { price: 50010, size: 1.0, total: 50010, cumulativeSize: 1.0 },
      ];
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics(asks, bids, 10);

      // Spread: 10, Mid Price: 50005
      // Percentage: (10 / 50005) * 100 = 0.019998...
      expect(result.spreadPercentage).toBeCloseTo(0.02, 3);
    });

    it("should return zero spread percentage when mid price is zero", () => {
      const result = calculateSpreadMetrics([], [], 10);

      expect(result.spreadPercentage).toBe(0);
    });

    it("should handle empty arrays", () => {
      const result = calculateSpreadMetrics([], [], 5);

      expect(result.spread).toBe(5);
      expect(result.midPrice).toBe(0);
      expect(result.spreadPercentage).toBe(0);
    });

    it("should handle when asks array is empty", () => {
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics([], bids, 10);

      expect(result.midPrice).toBe(25000); // (0 + 50000) / 2
    });

    it("should handle when bids array is empty", () => {
      const asks: Order[] = [
        { price: 50010, size: 1.0, total: 50010, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics(asks, [], 10);

      expect(result.midPrice).toBe(25005); // (50010 + 0) / 2
    });

    it("should use the spreadGrouping value as spread", () => {
      const asks: Order[] = [
        { price: 50010, size: 1.0, total: 50010, cumulativeSize: 1.0 },
      ];
      const bids: Order[] = [
        { price: 50000, size: 1.0, total: 50000, cumulativeSize: 1.0 },
      ];

      const result = calculateSpreadMetrics(asks, bids, 25);

      expect(result.spread).toBe(25);
    });
  });
});
