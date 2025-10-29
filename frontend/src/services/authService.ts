import api from './api';
import { useNavigate } from 'react-router-dom';

// Signup
export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/signup', { name, email, password });
  // Don't store token on signup - user should login separately
  return response.data;
};

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data._id);
  }
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};