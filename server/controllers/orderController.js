const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Portfolio = require('../models/portfolioSchema');
const marketService = require('../services/marketService');

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
exports.buyStock = async (req, res) => {
    try {
        const { ticker, quantity } = req.body;

        if (!ticker || !quantity) {
            return res.status(400).json({ success: false, error: 'Please provide ticker and quantity' });
        }

        // 1. Get real-time price
        const quote = await marketService.getQuote(ticker);
        const price = quote.price;
        const totalCost = price * quantity;

        // 2. Check user balance
        const user = await User.findById(req.user.id);
        if (user.balance < totalCost) {
            return res.status(400).json({ success: false, error: 'Insufficient funds' });
        }

        // 3. Create Transaction
        const transaction = await Transaction.create({
            user: req.user.id,
            ticker,
            type: 'BUY',
            quantity,
            price,
            totalCost,
        });

        // 4. Update Portfolio
        let portfolio = await Portfolio.findOne({ user: req.user.id });
        if (!portfolio) {
            portfolio = await Portfolio.create({ user: req.user.id, holdings: [] });
        }

        const holdingIndex = portfolio.holdings.findIndex(h => h.ticker === ticker.toUpperCase());

        if (holdingIndex > -1) {
            // Update existing holding (Moving average)
            const currentHolding = portfolio.holdings[holdingIndex];
            const newTotalQuantity = currentHolding.quantity + quantity;
            const newAveragePrice = ((currentHolding.averagePrice * currentHolding.quantity) + (price * quantity)) / newTotalQuantity;

            portfolio.holdings[holdingIndex].quantity = newTotalQuantity;
            portfolio.holdings[holdingIndex].averagePrice = newAveragePrice;
        } else {
            // Create new holding
            portfolio.holdings.push({
                ticker: ticker.toUpperCase(),
                quantity,
                averagePrice: price,
            });
        }

        await portfolio.save();

        // 5. Deduct User Balance
        user.balance -= totalCost;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                transaction,
                newBalance: user.balance,
            },
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
exports.sellStock = async (req, res) => {
    try {
        const { ticker, quantity } = req.body;

        if (!ticker || !quantity) {
            return res.status(400).json({ success: false, error: 'Please provide ticker and quantity' });
        }

        // 1. Check if user owns the stock and has enough quantity
        const portfolio = await Portfolio.findOne({ user: req.user.id });
        if (!portfolio) {
            return res.status(400).json({ success: false, error: 'Portfolio not found' });
        }

        const holdingIndex = portfolio.holdings.findIndex(h => h.ticker === ticker.toUpperCase());
        if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient stock quantity to sell' });
        }

        // 2. Get real-time price
        const quote = await marketService.getQuote(ticker);
        const price = quote.price;
        const totalCredit = price * quantity;

        // 3. Create Transaction
        const transaction = await Transaction.create({
            user: req.user.id,
            ticker,
            type: 'SELL',
            quantity,
            price,
            totalCost: totalCredit,
        });

        // 4. Update Portfolio
        portfolio.holdings[holdingIndex].quantity -= quantity;

        // Remove holding if quantity is 0
        if (portfolio.holdings[holdingIndex].quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }

        await portfolio.save();

        // 5. Add to User Balance
        const user = await User.findById(req.user.id);
        user.balance += totalCredit;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                transaction,
                newBalance: user.balance,
            },
        });
    } catch (err) {
        throw err;
    }
};
