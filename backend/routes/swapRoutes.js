const express = require('express');
const {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest
} = require('../controllers/swapController');

const router = express.Router();

router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:requestId', respondToSwapRequest);

module.exports = router;