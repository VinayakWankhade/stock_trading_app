const express = require('express');
const {
    getAllUsers,
    getAllOrders,
    getAllFundTransactions,
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/funds', getAllFundTransactions);

module.exports = router;
