export const formatCurrency = (value, decimals = 2) =>
  `$${(Number(value) || 0).toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

// Redondeo de totales de venta/apartado: hasta .50 sube a .50, arriba de .50 sube al siguiente entero
export const roundUpCustom = (value) => {
  const cents = Math.round(value * 100) / 100;
  const intPart = Math.floor(cents);
  const decimalPart = Math.round((cents - intPart) * 100) / 100;

  if (decimalPart === 0) return cents;
  if (decimalPart <= 0.5) return intPart + 0.5;
  return intPart + 1;
};
