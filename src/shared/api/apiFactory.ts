import httpClient from '@/src/shared/api/httpClient';
import { getApiUrl, buildUrlWithParams } from '@/src/shared/api/utils';
import type { ApiResponse, QueryParams } from '@/src/shared/types/api';

export interface ApiServiceOptions {
  /** Custom plural endpoint for delete (e.g., 'clients/delete'). */
  pluralDelete?: string;
}

export interface CrudService<T = unknown> {
  getAll: (params?: QueryParams) => Promise<ApiResponse<T[]>>;
  getById: (id: number | string) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (data: Partial<T> & { id: number | string }) => Promise<ApiResponse<T>>;
  delete: (id: number | string) => Promise<ApiResponse<unknown>>;
  deleteMany: (data: unknown) => Promise<ApiResponse<unknown>>;
}

/**
 * Creates a CRUD API service for a given resource.
 */
export const createApiService = <T = unknown>(
  resource: string,
  options: ApiServiceOptions = {}
): CrudService<T> => {
  const { pluralDelete } = options;

  return {
    getAll: async (params) => {
      const url = params
        ? buildUrlWithParams(getApiUrl(resource), params)
        : getApiUrl(resource);
      return httpClient.get(url);
    },

    getById: async (id) => {
      return httpClient.get(getApiUrl(`${resource}/${id}`));
    },

    create: async (data) => {
      return httpClient.post(getApiUrl(resource), data);
    },

    update: async (data) => {
      return httpClient.patch(getApiUrl(`${resource}/${data.id}`), data);
    },

    delete: async (id) => {
      return httpClient.delete(getApiUrl(`${resource}/${id}`));
    },

    deleteMany: async (data) => {
      const endpoint = pluralDelete || `${resource}/delete`;
      return httpClient.post(getApiUrl(endpoint), data);
    },
  };
};
