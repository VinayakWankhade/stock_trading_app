const express = require('express');
const { getPortfolio, getTransactions } = require('../controllers/portfolioController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All portfolio routes require authentication

router.get('/', getPortfolio);
router.get('/transactions', getTransactions);

module.exports = router;
