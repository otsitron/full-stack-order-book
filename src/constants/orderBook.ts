export const ORDER_COUNT = 13;

export const BASE_PRICES = {
  BTC: 50000,
  ETH: 3000,
} as const;

export const PRICE_VARIATION = 100;

export const DEFAULT_MAX_SIZE = 100;

export const ORDER_SIZE_RANGE = {
  min: 0.1,
  max: 2.5,
} as const;

export const SIZE_VARIATION = 0.5;
export const MIN_SIZE = 0.1;

export const SIZE_DECIMALS = 4;
export const TOTAL_DECIMALS = 2;
export const PRICE_DECIMALS = 2;

export const UPDATE_INTERVAL_MS = 1000;
export const CONNECTION_TIMEOUT_MS = 10000;
export const RECONNECT_DELAY_MS = 3000;
