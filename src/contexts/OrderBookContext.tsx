"use client";

import { createContext, useContext } from "react";
import { SymbolType } from "@/constants";

export interface Order {
  price: number;
  size: number;
  total: number;
  cumulativeSize: number;
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
  asks: Order[];
  bids: Order[];
  maxSize: number;
  priceChanges: Map<number, PriceChange>;

  selectedSymbol: SymbolType;
  precision: number;
  spreadGrouping: number;

  isConnected: boolean;
  useFallbackData: boolean;

  setSelectedSymbol: (symbol: SymbolType) => void;
  setPrecision: (precision: number) => void;
  setSpreadGrouping: (grouping: number) => void;

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
