import axios from 'axios';

// Determina la URL base para el backend en NestJS.
// Si no se define VITE_API_URL, utiliza la misma IP/host desde donde se accede al frontend (útil para celulares/tablets en la misma red Wi-Fi)
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de peticiones (útil para tokens de autenticación en el futuro)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
