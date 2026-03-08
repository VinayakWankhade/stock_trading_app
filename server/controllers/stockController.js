const marketService = require('../services/marketService');
const Stock = require('../models/stockSchema');

// @desc    Get stock quote
// @route   GET /api/stocks/quote/:ticker
// @access  Private
exports.getQuote = async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        const quote = await marketService.getQuote(ticker);

        res.status(200).json({
            success: true,
            data: quote,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            error: `Could not fetch quote for ${req.params.ticker}. Ensure ticker is valid.`,
        });
    }
};

// @desc    Get stock profile
// @route   GET /api/stocks/profile/:ticker
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        console.log(`[Controller] Fetching profile for: ${ticker}`);
        const profile = await marketService.getProfile(ticker);

        if (!profile || Object.keys(profile).length === 0) {
            console.warn(`[Controller] Profile empty for: ${ticker}`);
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Get stock candles
// @route   GET /api/stocks/candles/:ticker
// @access  Private
exports.getCandles = async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        console.log(`[Controller] Fetching candles for: ${ticker}`);
        const resolution = req.query.resolution || 'D';
        const to = Math.floor(Date.now() / 1000);
        const from = to - (60 * 60 * 24 * 30); // Last 30 days

        const candles = await marketService.getCandles(ticker, resolution, from, to);

        res.status(200).json({
            success: true,
            data: candles,
        });
    } catch (err) {
        throw err;
    }
};
