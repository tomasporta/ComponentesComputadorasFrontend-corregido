import { defineBoot } from '#q-app/wrappers';
import axios, { isAxiosError, type AxiosInstance } from 'axios';
import { useAuthStore } from 'stores/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Instancia de axios apuntando a la API de Componentes Computadoras.
// baseURL relativa: el devServer de Quasar reenvia /api a la API .NET
// (ver "proxy" en quasar.config.ts).
// Los stores importan `api` directamente; `$api` queda disponible en los componentes.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default defineBoot(({ app, router }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  // ANTES de cada peticion: si hay sesion, se agrega el token en el header Authorization
  api.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  });

  // DESPUES de cada respuesta: si la API contesta 401, el token no sirve mas (vencido o invalido)
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      // Un 401 en /Auth/ son credenciales incorrectas, no una sesion vencida
      const esAuth = isAxiosError(error) && error.config?.url?.includes('/Auth/');
      if (isAxiosError(error) && error.response?.status === 401 && !esAuth) {
        useAuthStore().logout();
        void router.push('/login');
      }
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );
});

export { api };
