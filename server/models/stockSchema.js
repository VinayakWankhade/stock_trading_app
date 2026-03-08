const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: [true, 'Please add a ticker symbol'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a company name'],
    },
    description: {
        type: String,
    },
    sector: {
        type: String,
    },
    industry: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Stock', StockSchema);
