import api from './api';

// Create event
export const createEvent = async (title: string, startTime: string, endTime: string, status: string) => {
  const response = await api.post('/events', { title, startTime, endTime, status });
  return response.data;
};

// Get all events
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// Get event by ID
export const getEventById = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Update event
export const updateEvent = async (id: string, title: string, startTime: string, endTime: string, status: string) => {
  const response = await api.put(`/events/${id}`, { title, startTime, endTime, status });
  return response.data;
};

// Delete event
export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};