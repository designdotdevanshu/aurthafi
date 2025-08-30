const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

const CURRENCY = {
  // CODE: "USD",
  // SYMBOL: "$",
  CODE: "INR",
  SYMBOL: "₹",
  PRECISION: 2,
};

// function to format currency
const formatCurrency = (value: unknown): string => {
  if (typeof value !== "number") {
    value = Number(value);
  }
  return `${CURRENCY.SYMBOL}${(value as number).toFixed(CURRENCY.PRECISION)}`;
};

export { COLORS, CURRENCY, formatCurrency };
