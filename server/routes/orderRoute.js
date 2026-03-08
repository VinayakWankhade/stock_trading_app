const express = require('express');
const { buyStock, sellStock } = require('../controllers/transactionController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All trade routes require authentication

router.post('/buy', buyStock);
router.post('/sell', sellStock);

module.exports = router;
