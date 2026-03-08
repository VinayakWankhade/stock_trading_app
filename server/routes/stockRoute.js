const express = require('express');
const { getQuote, getProfile, getCandles } = require('../controllers/stockController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/quote/:ticker', getQuote);
router.get('/profile/:ticker', getProfile);
router.get('/candles/:ticker', getCandles);

module.exports = router;
