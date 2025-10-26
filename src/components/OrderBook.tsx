"use client";

import React from "react";
import OrderBookHeader from "./OrderBookHeader";
import OrderBookTable from "./OrderBookTable";
import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/design-system";

export default function OrderBook() {
  return (
    <Container>
      <OrderBookHeader />

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
    </Container>
  );
}
