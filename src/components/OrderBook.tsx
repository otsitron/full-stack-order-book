"use client";

import React from "react";
import OrderBookHeader from "./OrderBookHeader";
import OrderBookTable from "./OrderBookTable";
import OrderBookControls from "./OrderBookControls";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/design-system";

export default function OrderBook() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
      <OrderBookHeader />

      {/* Orders Section */}
      <div className="p-4">
        <h2 className="text-lg text-gray-300 mb-4">Orders</h2>

        <Tabs defaultValue="orders">
          <TabList className="mb-4">
            <Tab value="orders">Orders</Tab>
            <Tab value="trades">Trades</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="orders">
              <OrderBookTable />
            </TabPanel>
            <TabPanel value="trades">
              <div className="text-center text-gray-400 py-8">
                Trades coming soon...
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <OrderBookControls />
    </div>
  );
}
