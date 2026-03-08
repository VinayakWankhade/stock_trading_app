const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Portfolio = require('../models/portfolioSchema');
const marketService = require('../services/marketService');

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
exports.buyStock = async (req, res) => {
    try {
        const ticker = req.body.ticker || req.body.symbol;
        const { quantity } = req.body;

        if (!ticker || !quantity) {
            return res.status(400).json({ success: false, error: 'Please provide ticker and quantity' });
        }

        console.log(`[Transaction] CP1: Initiating buy for ${ticker}, quantity ${quantity}`);

        // 1. Get real-time price
        const quote = await marketService.getQuote(ticker);
        console.log(`[Transaction] CP2: Quote received:`, quote.price);
        const price = quote.price;
        const totalCost = parseFloat((price * quantity).toFixed(2));

        // 2. Check user balance
        const user = await User.findById(req.user?.id);
        if (!user) {
            console.error(`[Transaction] ERR: User not found`);
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        console.log(`[Transaction] CP3: Balance ${user.balance}, Cost ${totalCost}`);
        if (user.balance < totalCost) {
            return res.status(400).json({ success: false, error: 'Insufficient funds' });
        }

        // 3. Create Transaction
        console.log(`[Transaction] CP4: Creating transaction...`);
        const transaction = await Transaction.create({
            user: user._id,
            ticker: ticker.toUpperCase(),
            type: 'BUY',
            quantity: Number(quantity),
            price: Number(price),
            totalCost: totalCost,
        });
        console.log(`[Transaction] CP5: Transaction record: ${transaction._id}`);

        // 4. Update Portfolio
        console.log(`[Transaction] CP6: Finding Portfolio...`);
        let portfolio = await Portfolio.findOne({ user: user._id });
        if (!portfolio) {
            console.log(`[Transaction] CP7: Creating new Portfolio...`);
            portfolio = await Portfolio.create({ user: user._id, holdings: [] });
        }

        const holdingIndex = portfolio.holdings.findIndex(h => h.ticker === ticker.toUpperCase());
        console.log(`[Transaction] CP8: Holding Index: ${holdingIndex}`);

        if (holdingIndex > -1) {
            const currentHolding = portfolio.holdings[holdingIndex];
            const newTotalQuantity = currentHolding.quantity + Number(quantity);
            const newAveragePrice = ((currentHolding.averagePrice * currentHolding.quantity) + (price * quantity)) / newTotalQuantity;

            portfolio.holdings[holdingIndex].quantity = newTotalQuantity;
            portfolio.holdings[holdingIndex].averagePrice = parseFloat(newAveragePrice.toFixed(4));
        } else {
            portfolio.holdings.push({
                ticker: ticker.toUpperCase(),
                quantity: Number(quantity),
                averagePrice: price,
            });
        }

        console.log(`[Transaction] CP9: Saving Portfolio...`);
        await portfolio.save();

        // 5. Deduct User Balance
        console.log(`[Transaction] CP10: Updating User Balance...`);
        user.balance = parseFloat((user.balance - totalCost).toFixed(2));
        await user.save();

        console.log(`[Transaction] BUY SUCCESS: ${ticker}`);
        res.status(200).json({
            success: true,
            data: {
                transaction,
                newBalance: user.balance,
            },
        });
    } catch (err) {
        console.error(`[Transaction] CRITICAL BUY ERROR:`, err.stack);
        res.status(500).json({ success: false, error: err.message || 'Server error during buy transaction' });
    }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
exports.sellStock = async (req, res) => {
    try {
        const ticker = req.body.ticker || req.body.symbol;
        const { quantity } = req.body;

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
        console.error(`[Transaction] CRITICAL SELL ERROR:`, err.stack);
        res.status(500).json({ success: false, error: err.message || 'Server error during sell transaction' });
    }
};
