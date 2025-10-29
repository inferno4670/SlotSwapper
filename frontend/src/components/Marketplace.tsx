import React, { useState, useEffect } from 'react';
import { 
  getSwappableSlots, 
  createSwapRequest, 
  acceptSwapRequest, 
  rejectSwapRequest,
  getUserSwapRequests
} from '../services/swapService';
import { getEvents } from '../services/eventService';

interface User {
  _id: string;
  name: string;
}

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  userId: User;
}

interface SwapRequest {
  _id: string;
  requesterId: User;
  responderId: User;
  mySlotId: Event;
  theirSlotId: Event;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const Marketplace: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchSwapRequests();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getSwappableSlots();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      alert('Failed to fetch events. Please try again.');
    }
  };

  const fetchSwapRequests = async () => {
    try {
      const data = await getUserSwapRequests();
      setSwapRequests(data);
    } catch (error) {
      console.error('Failed to fetch swap requests:', error);
      alert('Failed to fetch swap requests. Please try again.');
    }
  };

  const handleRequestSwap = async (eventId: string) => {
    if (!selectedEventId) {
      alert('Please select your event to swap');
      return;
    }

    try {
      await createSwapRequest(selectedEventId, eventId);
      fetchSwapRequests();
      alert('Swap request sent successfully!');
    } catch (error) {
      console.error('Failed to request swap:', error);
      alert('Failed to request swap. Please try again.');
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      await acceptSwapRequest(swapId);
      fetchSwapRequests();
      fetchEvents();
      alert('Swap accepted successfully!');
    } catch (error) {
      console.error('Failed to accept swap:', error);
      alert('Failed to accept swap. Please try again.');
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      await rejectSwapRequest(swapId);
      fetchSwapRequests();
      alert('Swap rejected.');
    } catch (error) {
      console.error('Failed to reject swap:', error);
      alert('Failed to reject swap. Please try again.');
    }
  };

  const getStatusBadge = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge badge-swappable">Accepted</span>;
      case 'REJECTED':
        return <span className="badge badge-busy">Rejected</span>;
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div>
      <h2 className="mb-4">Marketplace</h2>
      
      <div className="card mb-4">
        <h3>Your Swappable Events</h3>
        <div className="form-group">
          <label className="form-label">Select your event to swap:</label>
          <select 
            className="form-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.title} - {new Date(event.startTime).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card mb-4">
        <h3>Available Swaps</h3>
        {events.length === 0 ? (
          <p className="text-center">No swappable events available. Mark your events as swappable in the Calendar.</p>
        ) : (
          <ul className="list-unstyled">
            {events
              .filter((event: Event) => event._id !== selectedEventId)
              .map((event: Event) => (
                <li key={event._id} className="list-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">{event.title}</h4>
                      <p className="mb-1">
                        {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
                      </p>
                      <p className="mb-1 text-secondary">
                        Posted by: {event.userId.name}
                      </p>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleRequestSwap(event._id)}
                      disabled={!selectedEventId}
                    >
                      Request Swap
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Your Swap Requests</h3>
        {swapRequests.length === 0 ? (
          <p className="text-center">No swap requests found.</p>
        ) : (
          <ul className="list-unstyled">
            {swapRequests.map(request => (
              <li key={request._id} className="list-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">
                      Swap: {request.mySlotId.title} ↔ {request.theirSlotId.title}
                    </h4>
                    <p className="mb-1">
                      {new Date(request.mySlotId.startTime).toLocaleString()} ↔ {new Date(request.theirSlotId.startTime).toLocaleString()}
                    </p>
                    <p className="mb-1 text-secondary">
                      {request.requesterId._id === request.mySlotId.userId._id ? 
                        `From: ${request.requesterId.name} → To: ${request.responderId.name}` : 
                        `From: ${request.responderId.name} → To: ${request.requesterId.name}`}
                    </p>
                    <div className="mb-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {request.status === 'PENDING' && (
                      <>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleAcceptSwap(request._id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-sm btn-error"
                          onClick={() => handleRejectSwap(request._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
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

export default Marketplace;