const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// Get swappable slots (excluding requester's)
const getSwappableSlots = async (req, res) => {
  const userId = req.user.id;

  try {
    const slots = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: userId }
    }).populate('userId', 'name');

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create swap request
const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const requesterId = req.user.id;

  try {
    // Validate slots
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found' });
    }

    if (mySlot.userId.toString() !== requesterId) {
      return res.status(401).json({ message: 'Not authorized to swap this slot' });
    }

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Both slots must be swappable' });
    }

    // Check if swap request already exists
    const existingRequest = await SwapRequest.findOne({
      requesterId,
      responderId: theirSlot.userId,
      mySlotId,
      theirSlotId,
      status: 'PENDING'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Swap request already exists' });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      requesterId,
      responderId: theirSlot.userId,
      mySlotId,
      theirSlotId,
      status: 'PENDING'
    });

    // Update slot statuses
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to swap request
const respondToSwapRequest = async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body;
  const responderId = req.user.id;

  try {
    // Find swap request
    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.responderId.toString() !== responderId) {
      return res.status(401).json({ message: 'Not authorized to respond to this request' });
    }

    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request already responded to' });
    }

    // Update request status
    swapRequest.status = accept ? 'ACCEPTED' : 'REJECTED';
    await swapRequest.save();

    // Get slots
    const mySlot = await Event.findById(swapRequest.mySlotId);
    const theirSlot = await Event.findById(swapRequest.theirSlotId);

    if (accept) {
      // Swap ownership
      mySlot.userId = swapRequest.responderId;
      theirSlot.userId = swapRequest.requesterId;
      
      // Set status to BUSY
      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';
    } else {
      // Revert to SWAPPABLE
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
    }

    await mySlot.save();
    await theirSlot.save();

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get swap requests for the user (both as requester and responder)
const getUserSwapRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const requests = await SwapRequest.find({
      $or: [
        { requesterId: userId },
        { responderId: userId }
      ]
    })
    .populate('requesterId', 'name')
    .populate('responderId', 'name')
    .populate('mySlotId')
    .populate('theirSlotId');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getUserSwapRequests
};