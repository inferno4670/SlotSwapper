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
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedUserEventId, setSelectedUserEventId] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchUserEvents();
    fetchSwapRequests();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getSwappableSlots();
      setEvents(data);
    } catch (error: any) {
      console.error('Failed to fetch events:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to fetch events. Please try again.');
      }
    }
  };

  const fetchUserEvents = async () => {
    try {
      const data = await getEvents();
      // Filter for swappable events only
      const swappableEvents = data.filter((event: Event) => event.status === 'SWAPPABLE');
      setUserEvents(swappableEvents);
    } catch (error: any) {
      console.error('Failed to fetch user events:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to fetch user events. Please try again.');
      }
    }
  };

  const fetchSwapRequests = async () => {
    try {
      const data = await getUserSwapRequests();
      setSwapRequests(data);
    } catch (error: any) {
      console.error('Failed to fetch swap requests:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to fetch swap requests. Please try again.');
      }
    }
  };

  const openSwapModal = (event: Event) => {
    setSelectedEvent(event);
    setSelectedUserEventId('');
    setShowModal(true);
  };

  const closeSwapModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedUserEventId('');
  };

  const handleRequestSwap = async () => {
    if (!selectedEvent || !selectedUserEventId) {
      alert('Please select your event to swap');
      return;
    }

    try {
      await createSwapRequest(selectedUserEventId, selectedEvent._id);
      fetchSwapRequests();
      closeSwapModal();
      alert('Swap request sent successfully!');
    } catch (error: any) {
      console.error('Failed to request swap:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to request swap. Please try again.');
      }
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      await acceptSwapRequest(swapId);
      fetchSwapRequests();
      fetchEvents();
      fetchUserEvents();
      alert('Swap accepted successfully!');
    } catch (error: any) {
      console.error('Failed to accept swap:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to accept swap. Please try again.');
      }
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      await rejectSwapRequest(swapId);
      fetchSwapRequests();
      alert('Swap rejected.');
    } catch (error: any) {
      console.error('Failed to reject swap:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to reject swap. Please try again.');
      }
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
        <h3>Available Swaps</h3>
        {events.length === 0 ? (
          <p className="text-center">No swappable events available. Mark your events as swappable in the Calendar.</p>
        ) : (
          <ul className="list-unstyled">
            {events.map((event: Event) => (
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
                    onClick={() => openSwapModal(event)}
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
                    {request.status === 'PENDING' && request.requesterId._id !== localStorage.getItem('userId') && (
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

      {/* Swap Request Modal */}
      {showModal && selectedEvent && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Request Swap</h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={closeSwapModal}
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <h4>{selectedEvent.title}</h4>
              <p>
                {new Date(selectedEvent.startTime).toLocaleString()} to {new Date(selectedEvent.endTime).toLocaleString()}
              </p>
              <p className="text-secondary">
                Posted by: {selectedEvent.userId.name}
              </p>
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label">Select your event to swap:</label>
              <select 
                className="form-select"
                value={selectedUserEventId}
                onChange={(e) => setSelectedUserEventId(e.target.value)}
              >
                <option value="">Select your event</option>
                {userEvents.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title} - {new Date(event.startTime).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={handleRequestSwap}
                disabled={!selectedUserEventId}
              >
                Send Request
              </button>
              <button 
                className="btn btn-secondary"
                onClick={closeSwapModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;