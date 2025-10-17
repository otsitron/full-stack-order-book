"use client";

import React from "react";
import OrderBookHeader from "./OrderBookHeader";
import OrderBookTable from "./OrderBookTable";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/design-system";

export default function OrderBook() {
  return (
    <div className="w-full max-w-sm mx-auto bg-gray-900 text-white">
      <OrderBookHeader />

      {/* Orders Section */}
      <div className="p-2">
        <Tabs defaultValue="orders">
          <TabList className="mb-2">
            <Tab value="orders">Order Book</Tab>
            <Tab value="trades">Trades</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="orders">
              <OrderBookTable />
            </TabPanel>
            <TabPanel value="trades">
              <div className="text-center text-gray-400 py-4 text-sm">
                Trades coming soon...
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
