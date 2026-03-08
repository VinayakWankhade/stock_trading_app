const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    ticker: {
        type: String,
        required: [true, 'Please add a ticker symbol'],
        uppercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    totalCost: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
