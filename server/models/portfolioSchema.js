const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    holdings: [
        {
            ticker: {
                type: String,
                required: true,
                uppercase: true,
                trim: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 0,
            },
            averagePrice: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
