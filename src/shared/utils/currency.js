export const formatCurrency = (value, decimals = 2) =>
  `$${(value || 0).toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
