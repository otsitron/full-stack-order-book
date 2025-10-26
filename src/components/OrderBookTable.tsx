"use client";

import React, { useMemo } from "react";
import { useOrderBook } from "@/contexts";
import {
  Card,
  Select,
  ControlBar,
  FooterBar,
  TableHeader,
  InfoRow,
  RatioIndicator,
} from "@/design-system";
import { SPREAD_OPTIONS, PRECISION_SELECT_OPTIONS } from "@/constants";
import OrderRow from "./OrderRow";

export default function OrderBookTable() {
  const {
    asks,
    bids,
    maxSize,
    selectedSymbol,
    precision,
    setPrecision,
    spread,
    spreadPercentage,
    spreadGrouping,
    setSpreadGrouping,
    bidPercentage,
    askPercentage,
  } = useOrderBook();

  const reversedAsks = useMemo(() => [...asks].reverse(), [asks]);

  return (
    <Card variant="outlined" padding="none">
      <ControlBar>
        <Select
          options={SPREAD_OPTIONS}
          value={spreadGrouping.toString()}
          onChange={(value) => setSpreadGrouping(Number(value))}
          label="Spread"
          labelPosition="left"
          className="w-20"
        />
        <Select
          options={PRECISION_SELECT_OPTIONS}
          value={precision.toString()}
          onChange={(value) => setPrecision(Number(value))}
          label="Precision"
          labelPosition="left"
          className="w-20"
        />
      </ControlBar>

      <TableHeader
        columns={[
          "Price",
          `Size (${selectedSymbol})`,
          `Total (${selectedSymbol})`,
        ]}
      />

      {reversedAsks.map((ask, index) => (
        <OrderRow
          key={`ask-${index}`}
          order={ask}
          type="ask"
          maxCumulativeSize={maxSize}
          precision={precision}
        />
      ))}

      <InfoRow>
        <span>Spread</span>
        <span className="text-white">{spread.toFixed(2)}</span>
        <span>({spreadPercentage.toFixed(3)}%)</span>
      </InfoRow>

      {bids.map((bid, index) => (
        <OrderRow
          key={`bid-${index}`}
          order={bid}
          type="bid"
          maxCumulativeSize={maxSize}
          precision={precision}
        />
      ))}

      <FooterBar>
        <RatioIndicator
          leftLabel="Bid"
          leftValue={bidPercentage}
          leftColor="text-green-400"
          rightLabel="Ask"
          rightValue={askPercentage}
          rightColor="text-red-400"
          size="sm"
        />
      </FooterBar>
    </Card>
  );
}
