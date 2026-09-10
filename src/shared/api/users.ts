import httpClient from '@/src/shared/api/httpClient';
import { getApiUrl } from '@/src/shared/api/utils';
import type { ApiResponse } from '@/src/shared/types/api';
import type { ID } from '@/src/shared/types/domain';

export const getUser = async (id: ID): Promise<ApiResponse> => {
  return httpClient.get(getApiUrl(`user/${id}`));
};

export const updateUser = async (
  id: ID,
  data: Record<string, unknown>
): Promise<ApiResponse> => {
  return httpClient.patch(getApiUrl(`user/${id}`), data);
};

export const changePassword = async (
  _id: ID,
  data: Record<string, unknown>
): Promise<ApiResponse> => {
  return httpClient.post(getApiUrl('user/change_password'), data);
};
