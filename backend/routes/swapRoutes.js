const express = require('express');
const {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getUserSwapRequests
} = require('../controllers/swapController');

const router = express.Router();

router.get('/swappable-slots', getSwappableSlots);
router.get('/my-requests', getUserSwapRequests);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:requestId', respondToSwapRequest);

module.exports = router;