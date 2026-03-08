const Portfolio = require('../models/portfolioSchema');
const Transaction = require('../models/transactionModel');
const marketService = require('../services/marketService');

// @desc    Get user portfolio with real-time P&L
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.user.id });

        if (!portfolio) {
            return res.status(200).json({
                success: true,
                data: {
                    holdings: [],
                    totalValue: 0,
                    totalPL: 0,
                },
            });
        }

        // Enhance holdings with real-time data
        const enhancedHoldings = await Promise.all(
            portfolio.holdings.map(async (holding) => {
                try {
                    const quote = await marketService.getQuote(holding.ticker);
                    const currentPrice = quote.price;
                    const currentValue = currentPrice * holding.quantity;
                    const costBasis = holding.averagePrice * holding.quantity;
                    const unrealizedPL = currentValue - costBasis;
                    const percentPL = (unrealizedPL / costBasis) * 100;

                    return {
                        ...holding.toObject(),
                        currentPrice,
                        currentValue,
                        unrealizedPL,
                        percentPL,
                    };
                } catch (error) {
                    console.error(`Error fetching price for ${holding.ticker}:`, error.message);
                    return {
                        ...holding.toObject(),
                        currentPrice: null,
                        currentValue: null,
                        unrealizedPL: null,
                        percentPL: null,
                        error: 'Price data unavailable',
                    };
                }
            })
        );

        // Calculate total portfolio metrics
        let totalHoldingsValue = 0;
        let totalCostBasis = 0;

        enhancedHoldings.forEach((h) => {
            if (h.currentValue !== null) {
                totalHoldingsValue += h.currentValue;
                totalCostBasis += h.averagePrice * h.quantity;
            }
        });

        const totalUnrealizedPL = totalHoldingsValue - totalCostBasis;

        res.status(200).json({
            success: true,
            data: {
                holdings: enhancedHoldings,
                totalHoldingsValue,
                totalCostBasis,
                totalUnrealizedPL,
                userBalance: req.user.balance,
                totalAccountValue: totalHoldingsValue + req.user.balance,
            },
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Get user transaction history
// @route   GET /api/portfolio/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    } catch (err) {
        throw err;
    }
};
