import { AxiosError } from 'axios';
import httpClient from '@/src/shared/api/httpClient';
import { getPrinterUrl, getApiUrl } from '@/src/shared/api/utils';
import { getUserData } from '@/src/shared/api/utils';
import type { ApiResponse } from '@/src/shared/types/api';

/**
 * Send print job to printer service.
 */
export const getPrint = async (
  endpoint: string,
  data: Record<string, unknown>
): Promise<ApiResponse> => {
  const printerUrl = getPrinterUrl(endpoint);
  const user = getUserData();

  const printData = {
    ...data,
    token: user?.token,
    api_url: getApiUrl('store-printer'),
    store_printer: user?.store_printer,
  };

  const response = await httpClient.post(printerUrl, printData);
  return response;
};

export interface PrinterConnectionStatus {
  connected: boolean;
  error?: string;
}

/**
 * Test printer connection.
 */
export const testPrinterConnection = async (): Promise<PrinterConnectionStatus> => {
  try {
    const response = await httpClient.get(getPrinterUrl('status'), { timeout: 3000 });
    if (response.status === 200) {
      return { connected: true };
    }
    return { connected: false, error: response.data?.error || 'Error de impresora' };
  } catch (err) {
    const error = err as AxiosError<{ error?: string }>;
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      return { connected: false, error: 'Iniciar servidor de impresora' };
    }
    if (error.response?.status === 503) {
      return {
        connected: false,
        error: error.response.data?.error || 'Impresora no disponible',
      };
    }
    return { connected: false, error: 'Error de conexión' };
  }
};
