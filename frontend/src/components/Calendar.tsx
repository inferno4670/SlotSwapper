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
      alert('Failed to fetch events. Please try again.');
    }
  };

  const handleCreateEvent = async () => {
    if (!title || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createEvent(title, startTime, endTime, status);
      setTitle('');
      setStartTime('');
      setEndTime('');
      setStatus('BUSY');
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleToggleSwappable = async (id: string, currentStatus: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING') => {
    try {
      const newStatus = currentStatus === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
      await updateEvent(id, '', '', '', newStatus);
      fetchEvents();
    } catch (error) {
      console.error('Failed to toggle swappable status:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const getStatusBadge = (status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING') => {
    switch (status) {
      case 'SWAPPABLE':
        return <span className="badge badge-swappable">Swappable</span>;
      case 'SWAP_PENDING':
        return <span className="badge badge-pending">Pending</span>;
      default:
        return <span className="badge badge-busy">Busy</span>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Calendar</h2>
        <div className="d-flex gap-2">
          <span className="badge badge-swappable">Swappable</span>
          <span className="badge badge-busy">Busy</span>
          <span className="badge badge-pending">Pending</span>
        </div>
      </div>

      <div className="card">
        <h3>Add Event</h3>
        <div className="d-flex gap-2 flex-wrap">
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label">Status</label>
            <select 
              className="form-select" 
              value={status} 
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="BUSY">Busy</option>
              <option value="SWAPPABLE">Swappable</option>
            </select>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleCreateEvent}
          style={{ marginTop: '1rem' }}
        >
          Add Event
        </button>
      </div>

      <div className="card">
        <h3>Events</h3>
        {events.length === 0 ? (
          <p className="text-center">No events found. Add your first event above!</p>
        ) : (
          <ul className="list-unstyled">
            {events.map((event) => (
              <li key={event._id} className="list-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">{event.title}</h4>
                    <p className="mb-1">
                      {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
                    </p>
                    <div className="mb-2">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className={`btn btn-sm ${event.status === 'SWAPPABLE' ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleSwappable(event._id, event.status)}
                    >
                      {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Calendar;