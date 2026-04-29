import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (data: { email: string; password: string; display_name: string }) =>
    api.post('/auth/signup', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/me').then((r) => r.data),
};

export const themesApi = {
  list: () => api.get('/themes').then((r) => r.data),
};

export const mapsApi = {
  generate: (data: object) => api.post('/maps/generate', data).then((r) => r.data),
  list: () => api.get('/maps').then((r) => r.data),
  delete: (id: string) => api.delete(`/maps/${id}`),
};

export const foldersApi = {
  list: () => api.get('/folders').then((r) => r.data),
  create: (data: object) => api.post('/folders', data).then((r) => r.data),
  delete: (id: string) => api.delete(`/folders/${id}`),
};
