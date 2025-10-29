import React, { useState, useEffect } from 'react';
import { getUserSwapRequests, acceptSwapRequest, rejectSwapRequest } from '../services/swapService';

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
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      const data = await getUserSwapRequests();
      setSwapRequests(data);
      
      // Filter incoming requests (where current user is the responder)
      const incoming = data.filter((request: SwapRequest) => 
        request.responderId._id === userId
      );
      setIncomingRequests(incoming);
      
      // Filter outgoing requests (where current user is the requester)
      const outgoing = data.filter((request: SwapRequest) => 
        request.requesterId._id === userId
      );
      setOutgoingRequests(outgoing);
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

  const handleAccept = async (requestId: string) => {
    try {
      await acceptSwapRequest(requestId);
      alert('Swap request accepted!');
      fetchSwapRequests(); // Refresh the requests
    } catch (error: any) {
      console.error('Failed to accept swap request:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to accept swap request. Please try again.');
      }
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectSwapRequest(requestId);
      alert('Swap request rejected.');
      fetchSwapRequests(); // Refresh the requests
    } catch (error: any) {
      console.error('Failed to reject swap request:', error);
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        // Token might be invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        alert('Failed to reject swap request. Please try again.');
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
      <h2>Notifications</h2>
      
      <div className="card mb-4">
        <h3>Incoming Swap Requests</h3>
        {incomingRequests.length === 0 ? (
          <p className="text-center">No incoming swap requests</p>
        ) : (
          <ul className="list-unstyled">
            {incomingRequests
              .filter(request => request.status === 'PENDING')
              .map(request => (
                <li key={request._id} className="list-item">
                  <div>
                    <h4 className="mb-1">
                      Swap Request: {request.mySlotId.title} ↔ {request.theirSlotId.title}
                    </h4>
                    <p className="mb-1">
                      From: {request.requesterId.name}
                    </p>
                    <p className="mb-1 text-secondary">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    <p className="mb-2">
                      {new Date(request.mySlotId.startTime).toLocaleString()} ↔ {new Date(request.theirSlotId.startTime).toLocaleString()}
                    </p>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => handleReject(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
      
      <div className="card">
        <h3>Outgoing Swap Requests</h3>
        {outgoingRequests.length === 0 ? (
          <p className="text-center">No outgoing swap requests</p>
        ) : (
          <ul className="list-unstyled">
            {outgoingRequests.map(request => (
              <li key={request._id} className="list-item">
                <div>
                  <h4 className="mb-1">
                    Swap Request: {request.mySlotId.title} ↔ {request.theirSlotId.title}
                  </h4>
                  <p className="mb-1">
                    To: {request.responderId.name}
                  </p>
                  <p className="mb-1 text-secondary">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    {new Date(request.mySlotId.startTime).toLocaleString()} ↔ {new Date(request.theirSlotId.startTime).toLocaleString()}
                  </p>
                  <div className="mb-2">
                    {getStatusBadge(request.status)}
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

export default Notifications;