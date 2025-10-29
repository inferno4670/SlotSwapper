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
  const [notifications, setNotifications] = useState<SwapRequest[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getUserSwapRequests();
      // Filter for pending requests where the current user is the responder
      const pendingRequests = data.filter((request: SwapRequest) => 
        request.status === 'PENDING' && 
        request.responderId._id === localStorage.getItem('userId')
      );
      setNotifications(pendingRequests);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      alert('Failed to fetch notifications. Please try again.');
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptSwapRequest(requestId);
      alert('Swap request accepted!');
      fetchNotifications(); // Refresh the notifications
    } catch (error) {
      console.error('Failed to accept swap request:', error);
      alert('Failed to accept swap request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectSwapRequest(requestId);
      alert('Swap request rejected.');
      fetchNotifications(); // Refresh the notifications
    } catch (error) {
      console.error('Failed to reject swap request:', error);
      alert('Failed to reject swap request. Please try again.');
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <div className="card">
        {notifications.length === 0 ? (
          <p className="text-center">No new notifications</p>
        ) : (
          <ul className="list-unstyled">
            {notifications.map(notification => (
              <li key={notification._id} className="list-item">
                <div>
                  <h4 className="mb-1">
                    Swap Request: {notification.mySlotId.title} ↔ {notification.theirSlotId.title}
                  </h4>
                  <p className="mb-1">
                    From: {notification.requesterId.name}
                  </p>
                  <p className="mb-1 text-secondary">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    {new Date(notification.mySlotId.startTime).toLocaleString()} ↔ {new Date(notification.theirSlotId.startTime).toLocaleString()}
                  </p>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleAccept(notification._id)}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleReject(notification._id)}
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
    </div>
  );
};

export default Notifications;