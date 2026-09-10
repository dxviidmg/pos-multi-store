import httpClient from '@/src/shared/api/httpClient';
import { getApiUrl } from '@/src/shared/api/utils';

export const createSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/create'), data);

export const getSubscriptions = () =>
  httpClient.get(getApiUrl('subscriptions'));

export const cancelSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/cancel'), data);

export const updateSubscriptionCard = (data) =>
  httpClient.post(getApiUrl('subscriptions/update-card'), data);
