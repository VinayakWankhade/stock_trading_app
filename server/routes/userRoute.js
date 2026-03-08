const express = require('express');
const { register, login, getMe, addFunds, withdrawFunds, getFundHistory, toggleWatchlist } = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/funds/add', protect, addFunds);
router.post('/funds/withdraw', protect, withdrawFunds);
router.get('/funds/history', protect, getFundHistory);
router.post('/watchlist/toggle', protect, toggleWatchlist);

module.exports = router;
