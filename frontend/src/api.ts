import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

console.log('[API] baseURL:', import.meta.env.VITE_API_BASE_URL || 'http://100.117.176.41:1982/api/v1');

// Request interceptor for adding token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Settings interfaces
export interface Settings {
  community_name: string;
  logo_url: string;
  primary_color: string;
  footer_text: string;
  social_instagram: string;
  social_linkedin: string;
  social_website: string;
  landing_headline: string;
  landing_description: string;
  landing_features: string;
  margin_persen: number;
}

export interface SettingsUpdate {
  community_name?: string;
  logo_url?: string;
  primary_color?: string;
  footer_text?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_website?: string;
  landing_headline?: string;
  landing_description?: string;
  landing_features?: string;
  margin_persen?: number;
}

// Settings API
export const getSettings = () => api.get<Settings>('/settings/');
export const getSettingsAdmin = () => api.get<Settings>('/settings/admin');
export const updateSettingsAdmin = (data: SettingsUpdate) => api.put('/settings/admin', data);
export const resetDatabaseAdmin = () => api.post('/settings/admin/reset-db');

// Auth API
export interface RegisterData {
  nama: string;
  email: string;
  no_wa?: string;
  password: string;
}

export interface LoginPayload {
  password: string;
  identifier?: string;  // Backend expects 'identifier' (can be email or phone)
  email?: string;  // Keep for backward compatibility
  phone_number?: string;
}

// Transform login payload: map email to identifier for backend
export const login = (payload: LoginPayload) => {
  const transformedPayload = {
    ...payload,
    identifier: payload.identifier || payload.email || payload.phone_number || ''
  };
  // Remove email/phone_number fields, only send identifier
  delete transformedPayload.email;
  delete transformedPayload.phone_number;
  return api.post<{ access_token: string; token_type: string }>('/auth/login', transformedPayload);
};

// Anggota API (admin)
export interface Anggota {
  id: number;
  nama: string;
  email: string;
  no_wa?: string;
  role: string;
  status: string;
}

export const getAnggotaList = () => api.get<Anggota[]>('/anggota/list');

export default api;
