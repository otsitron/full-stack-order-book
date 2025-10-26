export type SymbolType = "BTC" | "ETH";

export const SYMBOLS: SymbolType[] = ["BTC", "ETH"];

export const SYMBOL_ICONS = {
  BTC: "B",
  ETH: "E",
} as const;

export const SYMBOL_OPTIONS = SYMBOLS.map((symbol) => ({
  value: symbol,
  label: symbol,
}));
