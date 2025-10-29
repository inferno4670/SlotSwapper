import api from './api';

// Get swappable slots
export const getSwappableSlots = async () => {
  const response = await api.get('/swappable-slots');
  return response.data;
};

// Create swap request
export const createSwapRequest = async (mySlotId: string, theirSlotId: string) => {
  const response = await api.post('/swap-request', { mySlotId, theirSlotId });
  return response.data;
};

// Respond to swap request
export const respondToSwapRequest = async (requestId: string, accept: boolean) => {
  const response = await api.post(`/swap-response/${requestId}`, { accept });
  return response.data;
};