import api from './api';

// Signup
export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    // Don't store token on signup - user should login separately
    return response.data;
  } catch (error: any) {
    console.error('Signup API error:', error);
    // Log the full error for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
    }
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    // Log the full error for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};