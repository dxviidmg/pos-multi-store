import httpClient from './httpClient';
import { getApiUrl } from './utils';

export const createSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/create'), data);

export const getSubscriptions = () =>
  httpClient.get(getApiUrl('subscriptions'));

export const cancelSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/cancel'), data);

export const updateSubscriptionCard = (data) =>
  httpClient.post(getApiUrl('subscriptions/update-card'), data);
