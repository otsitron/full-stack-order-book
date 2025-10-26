export const PRECISION_OPTIONS = [0, 1, 2, 3, 4] as const;

export const DEFAULT_PRECISION = 2;

export const PRECISION_SELECT_OPTIONS = PRECISION_OPTIONS.map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));
