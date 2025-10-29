import api from './api';

// Get swappable slots
export const getSwappableSlots = async () => {
  const response = await api.get('/swappable-slots');
  return response.data;
};

// Get user's swap requests
export const getUserSwapRequests = async () => {
  const response = await api.get('/my-requests');
  return response.data;
};

// Create swap request
export const createSwapRequest = async (mySlotId: string, theirSlotId: string) => {
  const response = await api.post('/swap-request', { mySlotId, theirSlotId });
  return response.data;
};

// Accept swap request
export const acceptSwapRequest = async (requestId: string) => {
  const response = await api.post(`/swap-response/${requestId}`, { accept: true });
  return response.data;
};

// Reject swap request
export const rejectSwapRequest = async (requestId: string) => {
  const response = await api.post(`/swap-response/${requestId}`, { accept: false });
  return response.data;
};