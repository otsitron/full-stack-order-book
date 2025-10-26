import OrderBook from "@/components/OrderBook";
import { OrderBookProvider } from "@/contexts";

export default function Home() {
  return (
    <OrderBookProvider>
      <div className="min-h-screen p-2 bg-gray-900">
        <OrderBook />
      </div>
    </OrderBookProvider>
  );
}
