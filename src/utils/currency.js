export const formatCurrency = (value, decimals = 2) =>
  `$${(Number(value) || 0).toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
