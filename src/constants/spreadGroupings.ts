export const SPREAD_GROUPINGS = [1, 5, 10, 25, 50, 100, 500];

export const SPREAD_OPTIONS = SPREAD_GROUPINGS.map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));
