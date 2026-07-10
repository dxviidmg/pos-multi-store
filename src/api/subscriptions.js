import httpClient from './httpClient';
import { getApiUrl } from './utils';

export const createSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/create'), data);
