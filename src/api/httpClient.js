import axios from 'axios';
import { logger } from '../utils/logger';
import { getUserData } from './utils';

const httpClient = axios.create({
  timeout: 60000,
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const user = getUserData();
    if (user?.token) {
      config.headers.Authorization = `Token ${user.token}`;
    }
    if (user?.store_id) {
      config.headers['store-id'] = user.store_id;
    }
    logger.info(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    logger.info(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      logger.error(`[API] ${status} ${config.url}`, error.response.data);

      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Handle suscripción vencida durante la sesión (403 con code específico).
      // No cerramos sesión: el dueño debe poder quedarse a renovar/pagar.
      if (status === 403 && error.response.data?.code === "subscription_expired") {
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const stored = JSON.parse(raw);
            if (!stored.access_blocked) {
              stored.access_blocked = true;
              localStorage.setItem('user', JSON.stringify(stored));
              if (window.location.pathname !== '/mi-plan-actual/') {
                window.location.href = '/mi-plan-actual/';
              }
            }
          }
        } catch (e) {
          logger.error('[API] Error manejando subscription_expired:', e);
        }
      }
    } else if (error.request) {
      logger.error('[API] No response received:', error.request);
    } else {
      logger.error('[API] Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
