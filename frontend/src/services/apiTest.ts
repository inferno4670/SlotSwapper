import api from './api';

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', api.defaults.baseURL);
    const response = await api.get('/');
    console.log('API connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
};