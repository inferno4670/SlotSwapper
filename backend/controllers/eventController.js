const Event = require('../models/Event');

// Create event
const createEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.create({
      title,
      startTime,
      endTime,
      status,
      userId
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events for user
const getEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const events = await Event.find({ userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findOne({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, startTime, endTime, status } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, userId },
      { title, startTime, endTime, status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findOneAndDelete({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};