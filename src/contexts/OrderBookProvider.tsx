"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  OrderBookContext,
  OrderBookContextType,
  Order,
  PriceChange,
} from "./OrderBookContext";
import {
  ORDER_COUNT,
  BASE_PRICES,
  PRICE_VARIATION,
  DEFAULT_MAX_SIZE,
  UPDATE_INTERVAL_MS,
  CONNECTION_TIMEOUT_MS,
  RECONNECT_DELAY_MS,
  SymbolType,
  DEFAULT_PRECISION,
} from "@/constants";
import {
  updateOrderSize,
  calculateCumulativeSizes,
  calculateMaxSize,
  generateGroupedOrders,
  processHyperliquidOrders,
  calculateVolumeRatios,
  calculateSpreadMetrics,
} from "@/utils/orderBookHelpers";

interface OrderBookProviderProps {
  children: ReactNode;
}

export const OrderBookProvider: React.FC<OrderBookProviderProps> = ({
  children,
}) => {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [maxSize, setMaxSize] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolType>("BTC");
  const [precision, setPrecision] = useState(DEFAULT_PRECISION);
  const [spreadGrouping, setSpreadGrouping] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [priceChanges] = useState<Map<number, PriceChange>>(new Map());
  const [useFallbackData, setUseFallbackData] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Generates fallback demo data when WebSocket connection fails.
   * Uses simulated price movements for demonstration purposes.
   * In production, real trading sites would reconnect to exchange WebSockets.
   */
  const generateFallbackData = useCallback(() => {
    const staticBasePrice = BASE_PRICES[selectedSymbol];
    // NOTE: Math.random() used for fallback demo data only
    // Real trading sites would use actual exchange WebSocket data
    const priceVariation = (Math.random() - 0.5) * PRICE_VARIATION;
    const basePrice = staticBasePrice + priceVariation;

    const generatedAsks = generateGroupedOrders(
      basePrice,
      ORDER_COUNT,
      false,
      spreadGrouping
    );

    const sortedAsks = generatedAsks.sort((a, b) => a.price - b.price);
    const asksWithCumulative = calculateCumulativeSizes(sortedAsks);
    setAsks(asksWithCumulative);

    const sortedBids = generateGroupedOrders(
      basePrice - spreadGrouping,
      ORDER_COUNT,
      true,
      spreadGrouping
    ).sort((a, b) => b.price - a.price);

    setBids(calculateCumulativeSizes(sortedBids));

    setMaxSize((prevMaxSize) => prevMaxSize || DEFAULT_MAX_SIZE);
  }, [selectedSymbol, spreadGrouping]);

  useEffect(() => {
    if (asks.length > 0 || bids.length > 0) {
      const actualMaxSize = calculateMaxSize(asks, bids);
      if (actualMaxSize > 0) {
        setMaxSize(actualMaxSize);
      }
    }
  }, [asks, bids]);

  const startFallbackInterval = useCallback(() => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
    }

    fallbackIntervalRef.current = setInterval(() => {
      setAsks((prevAsks) => updateOrderSize(prevAsks));
      setBids((prevBids) => updateOrderSize(prevBids));
    }, UPDATE_INTERVAL_MS);
  }, []);

  const setupFallbackMode = useCallback(() => {
    setIsConnected(false);
    setUseFallbackData(true);
    startFallbackInterval();
  }, [startFallbackInterval]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = `wss://api.hyperliquid.xyz/ws`;
      wsRef.current = new WebSocket(wsUrl);

      const connectionTimeout = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          console.warn("WebSocket connection timeout");
          wsRef.current.close();
        }
      }, CONNECTION_TIMEOUT_MS);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setUseFallbackData(false);
        clearTimeout(connectionTimeout);

        const subscription = {
          method: "subscribe",
          subscription: {
            type: "l2Book",
            coin: selectedSymbol,
            nSigFigs: precision,
          },
        };

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(subscription));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.data?.bids && data.data?.asks) {
            if (fallbackIntervalRef.current) {
              clearInterval(fallbackIntervalRef.current);
              fallbackIntervalRef.current = null;
            }

            const asksData = processHyperliquidOrders(data.data.asks);
            setAsks(asksData.sort((a, b) => a.price - b.price));
            const bidsData = processHyperliquidOrders(data.data.bids);
            setBids(bidsData.sort((a, b) => b.price - a.price));
            setUseFallbackData(false);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
          setupFallbackMode();
        }
      };

      wsRef.current.onclose = () => {
        setupFallbackMode();

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, RECONNECT_DELAY_MS);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setupFallbackMode();
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setIsConnected(false);
    }
  }, [selectedSymbol, precision, setupFallbackMode]);

  useEffect(() => {
    if (spreadGrouping !== 1) {
      generateFallbackData();
    }
  }, [spreadGrouping, generateFallbackData]);

  useEffect(() => {
    generateFallbackData();
    startFallbackInterval();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, [
    selectedSymbol,
    precision,
    spreadGrouping,
    connectWebSocket,
    generateFallbackData,
    startFallbackInterval,
  ]);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    connectWebSocket();
  }, [selectedSymbol, precision, connectWebSocket]);

  const { spread, spreadPercentage } = calculateSpreadMetrics(
    asks,
    bids,
    spreadGrouping
  );

  const { bidPercentage, askPercentage } = calculateVolumeRatios(bids, asks);

  const contextValue: OrderBookContextType = {
    asks,
    bids,
    maxSize,
    priceChanges,

    selectedSymbol,
    precision,
    spreadGrouping,

    isConnected,
    useFallbackData,

    setSelectedSymbol,
    setPrecision,
    setSpreadGrouping,

    spread,
    spreadPercentage,
    bidPercentage,
    askPercentage,
  };

  useEffect(() => {
    return () => {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <OrderBookContext.Provider value={contextValue}>
      {children}
    </OrderBookContext.Provider>
  );
};
