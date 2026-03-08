const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const FundTransaction = require('../models/fundTransactionModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Get all stock transactions (Orders)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Transaction.find({}).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Get all fund transactions
// @route   GET /api/admin/funds
// @access  Private/Admin
exports.getAllFundTransactions = async (req, res) => {
    try {
        const transactions = await FundTransaction.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    } catch (err) {
        throw err;
    }
};
