import React, { useState, useEffect } from 'react';
import { getSwappableSlots, createSwapRequest } from '../services/swapService';
import { getEvents } from '../services/eventService';

interface Slot {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  userId: {
    name: string;
  };
}

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
}

const Marketplace: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [userSlots, setUserSlots] = useState<Event[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSwappableSlots();
    fetchUserSlots();
  }, []);

  const fetchSwappableSlots = async () => {
    try {
      const data = await getSwappableSlots();
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch swappable slots:', error);
    }
  };

  const fetchUserSlots = async () => {
    try {
      const data = await getEvents();
      const swappableSlots = data.filter((event: Event) => event.status === 'SWAPPABLE');
      setUserSlots(swappableSlots);
    } catch (error) {
      console.error('Failed to fetch user slots:', error);
    }
  };

  const handleRequestSwap = async (theirSlotId: string) => {
    if (!selectedSlot) {
      alert('Please select your slot to offer');
      return;
    }

    try {
      await createSwapRequest(selectedSlot, theirSlotId);
      alert('Swap request sent!');
      setShowModal(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Failed to request swap:', error);
      alert('Failed to request swap');
    }
  };

  return (
    <div>
      <h2>Marketplace</h2>
      <div>
        <h3>Swappable Slots</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot._id}>
              <strong>{slot.title}</strong> - {new Date(slot.startTime).toLocaleString()} to {new Date(slot.endTime).toLocaleString()}
              <br />
              Owner: {slot.userId.name}
              <button onClick={() => {
                setShowModal(true);
                setSelectedSlot(slot._id);
              }}>
                Request Swap
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <h3>Select Your Slot to Offer</h3>
            <ul>
              {userSlots.map((slot) => (
                <li key={slot._id}>
                  <strong>{slot.title}</strong> - {new Date(slot.startTime).toLocaleString()} to {new Date(slot.endTime).toLocaleString()}
                  <button onClick={() => handleRequestSwap(selectedSlot!)}>Offer This Slot</button>
                </li>
              ))}
            </ul>
            <button onClick={() => {
              setShowModal(false);
              setSelectedSlot(null);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;