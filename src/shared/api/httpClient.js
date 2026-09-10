import axios from 'axios';
import { getUserData } from '@/src/shared/api/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';

const httpClient = axios.create({
  baseURL: API_URL,
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
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      const code = error.response.data?.code;

      // Handle 401 Unauthorized.
      // Cubre también el caso de tenant cancelado: el backend borra los tokens del
      // tenant, por lo que la siguiente petición de cualquier usuario (dueño o
      // trabajador, en cualquier máquina) recibe 401 y sale de la sesión.
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }

      // Suscripción vencida durante la sesión (403 subscription_expired), tras los 7 días
      // de gracia. Distinto de tenant cancelado (401): aquí el negocio sigue activo.
      // El dueño entra en "modo pago" (access_blocked → /mi-plan-actual/) para renovar;
      // administradores y vendedores quedan bloqueados.
      if (status === 403 && code === "subscription_expired") {
        if (typeof window !== 'undefined') {
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
            // Ignorar errores al leer/escribir el usuario en localStorage.
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
