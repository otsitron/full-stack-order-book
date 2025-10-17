"use client";

import React, {
  createContext,
  useContext,
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
  OrderBookData,
} from "./OrderBookContext";

interface OrderBookProviderProps {
  children: ReactNode;
}

export const OrderBookProvider: React.FC<OrderBookProviderProps> = ({
  children,
}) => {
  // State
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [maxSize, setMaxSize] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState<"BTC" | "ETH">("BTC");
  const [precision, setPrecision] = useState(2);
  const [isConnected, setIsConnected] = useState(false);
  const [priceChanges, setPriceChanges] = useState<Map<number, PriceChange>>(
    new Map()
  );
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<OrderBookData | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate fallback data when WebSocket fails
  const generateFallbackData = useCallback(() => {
    console.log("Generating fallback data for", selectedSymbol);
    const basePrice = selectedSymbol === "BTC" ? 50000 : 3000;
    const generateOrders = (
      basePrice: number,
      count: number,
      isBid: boolean
    ): Order[] => {
      return Array.from({ length: count }, (_, i) => {
        const priceOffset = isBid ? -i * 0.5 : i * 0.5;
        const price = basePrice + priceOffset;
        const size = Math.random() * 10 + 1;
        const total = price * size;
        return {
          price: Number(price.toFixed(precision)),
          size: Number(size.toFixed(4)),
          total: Number(total.toFixed(2)),
        };
      });
    };

    const newAsks = generateOrders(basePrice, 13, false);
    const newBids = generateOrders(basePrice - 0.5, 13, true);

    console.log(
      "Generated fallback data - asks:",
      newAsks.length,
      "bids:",
      newBids.length
    );

    setAsks(newAsks);
    setBids(newBids);

    const allSizes = [...newAsks, ...newBids].map((order) => order.size);
    setMaxSize(Math.max(...allSizes));
  }, [selectedSymbol, precision]);

  // Handle order book updates with smooth animations
  const handleOrderBookUpdate = useCallback((data: any) => {
    console.log("Processing order book data:", data);

    if (!data.data) {
      console.warn("No data field in WebSocket message");
      return;
    }

    const { asks: newAsks, bids: newBids } = data.data;
    console.log("Extracted asks:", newAsks, "bids:", newBids);

    // Validate data exists and is an array
    if (
      !newAsks ||
      !Array.isArray(newAsks) ||
      !newBids ||
      !Array.isArray(newBids)
    ) {
      console.warn("Invalid order book data received:", data);
      return;
    }

    // Convert to our format and calculate totals
    const processedAsks: Order[] = newAsks.map((ask: [number, number]) => ({
      price: ask[0],
      size: ask[1],
      total: ask[0] * ask[1],
    }));

    const processedBids: Order[] = newBids.map((bid: [number, number]) => ({
      price: bid[0],
      size: bid[1],
      total: bid[0] * bid[1],
    }));

    // Track price changes for visual feedback
    const newPriceChanges = new Map<number, PriceChange>();

    // Compare with previous data to detect changes
    if (lastDataRef.current) {
      const prevAsks = lastDataRef.current.asks;
      const prevBids = lastDataRef.current.bids;

      // Check ask price changes
      processedAsks.forEach((ask, index) => {
        const prevAsk = prevAsks[index];
        if (prevAsk && ask.price !== prevAsk.price) {
          newPriceChanges.set(ask.price, {
            price: ask.price,
            change: ask.price > prevAsk.price ? "up" : "down",
            timestamp: Date.now(),
          });
        }
      });

      // Check bid price changes
      processedBids.forEach((bid, index) => {
        const prevBid = prevBids[index];
        if (prevBid && bid.price !== prevBid.price) {
          newPriceChanges.set(bid.price, {
            price: bid.price,
            change: bid.price > prevBid.price ? "up" : "down",
            timestamp: Date.now(),
          });
        }
      });
    }

    // Calculate max size for depth visualization
    const allSizes = [...processedAsks, ...processedBids].map(
      (order) => order.size
    );
    const newMaxSize = Math.max(...allSizes);

    // Update state
    setAsks(processedAsks);
    setBids(processedBids);
    setMaxSize(newMaxSize);
    setPriceChanges(newPriceChanges);

    // Store current data for next comparison
    lastDataRef.current = {
      asks: processedAsks,
      bids: processedBids,
      maxSize: newMaxSize,
    };

    // Clear price change animations after 1 second
    setTimeout(() => {
      setPriceChanges(new Map());
    }, 1000);
  }, []);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Hyperliquid WebSocket endpoint
      const wsUrl = `wss://api.hyperliquid.xyz/ws`;
      wsRef.current = new WebSocket(wsUrl);

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          console.warn("WebSocket connection timeout");
          wsRef.current.close();
        }
      }, 10000); // 10 second timeout

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setUseFallbackData(false);
        clearTimeout(connectionTimeout);

        // Stop fallback data generation
        if (fallbackIntervalRef.current) {
          clearInterval(fallbackIntervalRef.current);
          fallbackIntervalRef.current = null;
        }

        // Subscribe to l2Book for the selected symbol
        const subscription = {
          method: "subscribe",
          subscription: {
            type: "l2Book",
            coin: selectedSymbol,
            nSigFigs: precision,
          },
        };

        // Ensure WebSocket is ready before sending
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(subscription));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);
          handleOrderBookUpdate(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setUseFallbackData(true);

        // Start fallback data generation
        generateFallbackData();
        fallbackIntervalRef.current = setInterval(generateFallbackData, 3000);

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setUseFallbackData(true);

        // Start fallback data generation
        generateFallbackData();
        fallbackIntervalRef.current = setInterval(generateFallbackData, 3000);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setIsConnected(false);
    }
  }, [selectedSymbol, precision, handleOrderBookUpdate, generateFallbackData]);

  // Initialize WebSocket connection
  useEffect(() => {
    // Generate initial fallback data to ensure UI has data
    generateFallbackData();
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
  }, [connectWebSocket, generateFallbackData]);

  // Reconnect when symbol or precision changes
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    connectWebSocket();
  }, [selectedSymbol, precision, connectWebSocket]);

  // Computed values
  const spread = asks[0]?.price - bids[0]?.price || 0;
  const spreadPercentage = (spread / bids[0]?.price) * 100 || 0;

  // Context value
  const contextValue: OrderBookContextType = {
    // Data
    asks,
    bids,
    maxSize,
    priceChanges,

    // Settings
    selectedSymbol,
    precision,

    // Connection
    isConnected,
    useFallbackData,

    // Actions
    setSelectedSymbol,
    setPrecision,

    // Computed values
    spread,
    spreadPercentage,
  };

  return (
    <OrderBookContext.Provider value={contextValue}>
      {children}
    </OrderBookContext.Provider>
  );
};
