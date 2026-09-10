// Re-exporta todo para mantener compatibilidad con imports existentes
export { MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, DAY_NAMES_SHORT, getFormattedDate, getFormattedDateTime, formatTimeFromDate, calculateTimeAgo, getDateDifference } from "@/src/shared/utils/date";
export { formatCurrency } from "@/src/shared/utils/currency";
export { exportToExcel } from "@/src/shared/utils/excel";
export { handlePrintTicket } from "@/src/shared/utils/print";
export { CHART_COLORS, getTied } from "@/src/shared/utils/chart";
export { getErrorMessage } from "@/src/shared/utils/error";
export { convertImageToWebp } from "@/src/shared/utils/image";
