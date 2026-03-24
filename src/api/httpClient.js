import axios from 'axios';
import { logger } from '../utils/logger';

const httpClient = axios.create({
  timeout: 60000,
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
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
    } else if (error.request) {
      logger.error('[API] No response received:', error.request);
    } else {
      logger.error('[API] Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
