import axios from 'axios';
import { UserDTO } from '../types/user';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
  user: UserDTO;
}

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<{ id: number; name: string; email: string; role: string; active: boolean }>('/auth/register', data);
    return response.data;
  },

  registerAdmin: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<{ id: number; name: string; email: string; role: string; active: boolean }>('/auth/register/admin', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get<UserDTO>('/users/me');
    return response.data;
  },

  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<UserDTO[]>('/users');
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get<UserDTO>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: { name?: string; bio?: string }) => {
    const response = await api.put<UserDTO>(`/users/${id}`, data);
    return response.data;
  },

  changePassword: async (id: number, data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put(`/users/${id}/password`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  deactivateUser: async (id: number) => {
    const response = await api.put<UserDTO>(`/users/${id}/deactivate`);
    return response.data;
  },

  activateUser: async (id: number) => {
    const response = await api.put<UserDTO>(`/users/${id}/activate`);
    return response.data;
  },
};
