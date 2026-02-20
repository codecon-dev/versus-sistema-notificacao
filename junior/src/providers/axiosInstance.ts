import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { post } from './api';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status &&
      [401, 403, 405].includes(error.response.status) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('auth/refresh')
      // !originalRequest.url?.includes('auth/logout')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('auth/refresh/');
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError);
        if (!originalRequest.url?.includes('auth')) {
          post('auth/logout');
          const redirectUrl = window.location.origin + '/login';
          window.location.href = redirectUrl;
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
