import axios from 'axios';
import { env } from '../config/env';
import { loadTokens, saveTokens, clearTokens } from './tokenStore';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
});

// Attach the access token to every request when present.
api.interceptors.request.use(async config => {
  const tokens = await loadTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// On a 401, try a one-time refresh and replay the original request.
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const isAuthCall = original?.url?.includes('/auth/');
    if (error.response?.status !== 401 || original?._retried || isAuthCall) {
      return Promise.reject(error);
    }
    original._retried = true;

    const tokens = await loadTokens();
    if (!tokens?.refreshToken) {
      await clearTokens();
      return Promise.reject(error);
    }
    try {
      const res = await axios.post(`${env.apiBaseUrl}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      });
      await saveTokens(res.data);
      original.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(original);
    } catch (refreshErr) {
      await clearTokens();
      return Promise.reject(refreshErr);
    }
  },
);
