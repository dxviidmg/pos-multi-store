import type { AxiosResponse } from 'axios';

/** Respuesta genérica de la API (Axios). */
export type ApiResponse<T = unknown> = AxiosResponse<T>;

/** Parámetros de query admitidos por los servicios. */
export type QueryParams = Record<string, string | number | boolean | null | undefined>;
