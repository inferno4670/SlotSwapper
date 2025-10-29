import api from './api';

// Signup
export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/signup', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};