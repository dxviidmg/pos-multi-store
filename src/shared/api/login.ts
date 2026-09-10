import httpClient from '@/src/shared/api/httpClient';
import { getApiUrl } from '@/src/shared/api/utils';
import type { ApiResponse } from '@/src/shared/types/api';
import type { AuthUser } from '@/src/shared/types/domain';

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Authenticate user with credentials.
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<ApiResponse<AuthUser>> => {
  const response = await httpClient.post(getApiUrl('api-token-auth'), credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
};
