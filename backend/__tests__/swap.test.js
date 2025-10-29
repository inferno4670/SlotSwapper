const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const swapRoutes = require('../routes/swapRoutes');

// Mock dependencies
jest.mock('../models/Event');
jest.mock('../models/SwapRequest');
jest.mock('jsonwebtoken');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.user = { id: 'user123' };
  next();
});

app.use('/api', swapRoutes);

describe('Swap Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/swappable-slots', () => {
    it('should get swappable slots', async () => {
      const mockSlots = [
        {
          _id: 'slot1',
          title: 'Meeting',
          startTime: new Date(),
          endTime: new Date(),
          status: 'SWAPPABLE',
          userId: { name: 'John Doe' }
        }
      ];

      Event.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSlots)
      });

      const res = await request(app).get('/api/swappable-slots');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /api/swap-request', () => {
    it('should create a swap request', async () => {
      const mockMySlot = {
        _id: 'mySlot',
        userId: 'user123',
        status: 'SWAPPABLE',
        save: jest.fn()
      };

      const mockTheirSlot = {
        _id: 'theirSlot',
        userId: 'user456',
        status: 'SWAPPABLE',
        save: jest.fn()
      };

      Event.findById
        .mockResolvedValueOnce(mockMySlot)
        .mockResolvedValueOnce(mockTheirSlot);

      SwapRequest.findOne.mockResolvedValue(null);
      SwapRequest.create.mockResolvedValue({
        _id: 'request123',
        requesterId: 'user123',
        responderId: 'user456',
        mySlotId: 'mySlot',
        theirSlotId: 'theirSlot',
        status: 'PENDING'
      });

      const res = await request(app)
        .post('/api/swap-request')
        .send({
          mySlotId: 'mySlot',
          theirSlotId: 'theirSlot'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id', 'request123');
    });

    it('should return 400 if slots are not swappable', async () => {
      const mockMySlot = {
        _id: 'mySlot',
        userId: 'user123',
        status: 'BUSY'
      };

      const mockTheirSlot = {
        _id: 'theirSlot',
        userId: 'user456',
        status: 'BUSY'
      };

      Event.findById
        .mockResolvedValueOnce(mockMySlot)
        .mockResolvedValueOnce(mockTheirSlot);

      const res = await request(app)
        .post('/api/swap-request')
        .send({
          mySlotId: 'mySlot',
          theirSlotId: 'theirSlot'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Both slots must be swappable');
    });
  });

  describe('POST /api/swap-response/:requestId', () => {
    it('should accept a swap request', async () => {
      const mockSwapRequest = {
        _id: 'request123',
        requesterId: 'user456',
        responderId: 'user123',
        mySlotId: 'mySlot',
        theirSlotId: 'theirSlot',
        status: 'PENDING',
        save: jest.fn()
      };

      const mockMySlot = {
        _id: 'mySlot',
        userId: 'user456',
        status: 'SWAP_PENDING',
        save: jest.fn()
      };

      const mockTheirSlot = {
        _id: 'theirSlot',
        userId: 'user123',
        status: 'SWAP_PENDING',
        save: jest.fn()
      };

      SwapRequest.findById.mockResolvedValue(mockSwapRequest);
      Event.findById
        .mockResolvedValueOnce(mockMySlot)
        .mockResolvedValueOnce(mockTheirSlot);

      const res = await request(app)
        .post('/api/swap-response/request123')
        .send({ accept: true });

      expect(res.status).toBe(200);
      expect(mockSwapRequest.status).toBe('ACCEPTED');
    });

    it('should reject a swap request', async () => {
      const mockSwapRequest = {
        _id: 'request123',
        requesterId: 'user456',
        responderId: 'user123',
        mySlotId: 'mySlot',
        theirSlotId: 'theirSlot',
        status: 'PENDING',
        save: jest.fn()
      };

      const mockMySlot = {
        _id: 'mySlot',
        userId: 'user456',
        status: 'SWAP_PENDING',
        save: jest.fn()
      };

      const mockTheirSlot = {
        _id: 'theirSlot',
        userId: 'user123',
        status: 'SWAP_PENDING',
        save: jest.fn()
      };

      SwapRequest.findById.mockResolvedValue(mockSwapRequest);
      Event.findById
        .mockResolvedValueOnce(mockMySlot)
        .mockResolvedValueOnce(mockTheirSlot);

      const res = await request(app)
        .post('/api/swap-response/request123')
        .send({ accept: false });

      expect(res.status).toBe(200);
      expect(mockSwapRequest.status).toBe('REJECTED');
    });
  });
});