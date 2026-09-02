import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const rawBaseUrl = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: rawBaseUrl.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { token, selectedCompanyId } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (selectedCompanyId && selectedCompanyId !== 'all') {
    config.headers['X-Company-Id'] = String(selectedCompanyId);
  }
  return config;
});

export default api;

export function openApiFile(path: string) {
  const baseURL = String(api.defaults.baseURL ?? '').replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const token = useAuthStore.getState().token;
  const separator = normalizedPath.includes('?') ? '&' : '?';
  const tokenQuery = token ? `${separator}token=${encodeURIComponent(token)}` : '';
  window.open(`${baseURL}${normalizedPath}${tokenQuery}`, '_blank', 'noopener,noreferrer');
}
