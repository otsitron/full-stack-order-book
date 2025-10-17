"use client";

import { createContext, useContext } from "react";

export interface Order {
  price: number;
  size: number;
  total: number;
}

export interface PriceChange {
  price: number;
  change: "up" | "down" | "none";
  timestamp: number;
}

export interface OrderBookData {
  asks: Order[];
  bids: Order[];
  maxSize: number;
}

export interface OrderBookContextType {
  // Data
  asks: Order[];
  bids: Order[];
  maxSize: number;
  priceChanges: Map<number, PriceChange>;

  // Settings
  selectedSymbol: "BTC" | "ETH";
  precision: number;

  // Connection
  isConnected: boolean;
  useFallbackData: boolean;

  // Actions
  setSelectedSymbol: (symbol: "BTC" | "ETH") => void;
  setPrecision: (precision: number) => void;

  // Computed values
  spread: number;
  spreadPercentage: number;
  bidPercentage: number;
  askPercentage: number;
}

export const OrderBookContext = createContext<OrderBookContextType | undefined>(
  undefined
);

export const useOrderBook = () => {
  const context = useContext(OrderBookContext);
  if (context === undefined) {
    throw new Error("useOrderBook must be used within an OrderBookProvider");
  }
  return context;
};
