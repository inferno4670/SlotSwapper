import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING'>('BUSY');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent(title, startTime, endTime, status);
      setTitle('');
      setStartTime('');
      setEndTime('');
      setStatus('BUSY');
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleToggleSwappable = async (id: string, currentStatus: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING') => {
    try {
      const newStatus = currentStatus === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
      await updateEvent(id, '', '', '', newStatus);
      fetchEvents();
    } catch (error) {
      console.error('Failed to toggle swappable status:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div>
      <h2>Calendar</h2>
      <div>
        <h3>Add Event</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="BUSY">Busy</option>
          <option value="SWAPPABLE">Swappable</option>
        </select>
        <button onClick={handleCreateEvent}>Add Event</button>
      </div>
      <div>
        <h3>Events</h3>
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <strong>{event.title}</strong> - {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
              <button onClick={() => handleToggleSwappable(event._id, event.status)}>
                {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
              </button>
              <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;