"use client";

import React from "react";
import { useOrderBook } from "@/contexts";
import { Input, Button } from "@/design-system";

export default function OrderBookControls() {
  const { selectedSymbol } = useOrderBook();

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            value="0.1"
            className="w-20"
            rightIcon={
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto min-h-0"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto min-h-0"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">USD</span>
          <span className="text-white font-medium">{selectedSymbol}</span>
        </div>
      </div>
    </div>
  );
}
