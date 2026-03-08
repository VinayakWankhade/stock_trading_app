const User = require('../models/userModel');
const FundTransaction = require('../models/fundTransactionModel');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        throw err;
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        throw err;
    }
};

// @desc    Get current logged in user
// @route   GET /api/user/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Add funds to balance
// @route   POST /api/user/funds/add
// @access  Private
exports.addFunds = async (req, res) => {
    try {
        const { amount, paymentMode } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Please provide a valid amount' });
        }

        const user = await User.findById(req.user.id);
        user.balance += Number(amount);
        await user.save();

        await FundTransaction.create({
            user: req.user.id,
            type: 'deposit',
            amount: Number(amount),
            paymentMode: paymentMode || 'IMPS',
        });

        res.status(200).json({
            success: true,
            data: { balance: user.balance },
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Withdraw funds from balance
// @route   POST /api/user/funds/withdraw
// @access  Private
exports.withdrawFunds = async (req, res) => {
    try {
        const { amount, paymentMode } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Please provide a valid amount' });
        }

        const user = await User.findById(req.user.id);

        if (user.balance < amount) {
            return res.status(400).json({ success: false, error: 'Insufficient balance' });
        }

        user.balance -= Number(amount);
        await user.save();

        await FundTransaction.create({
            user: req.user.id,
            type: 'withdrawal',
            amount: Number(amount),
            paymentMode: paymentMode || 'IMPS',
        });

        res.status(200).json({
            success: true,
            data: { balance: user.balance },
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Get fund transaction history
// @route   GET /api/user/funds/history
// @access  Private
exports.getFundHistory = async (req, res) => {
    try {
        const transactions = await FundTransaction.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (err) {
        throw err;
    }
};

// @desc    Toggle stock in watchlist
// @route   POST /api/user/watchlist/toggle
// @access  Private
exports.toggleWatchlist = async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) {
            return res.status(400).json({ success: false, error: 'Please provide a symbol' });
        }

        const user = await User.findById(req.user.id);
        const index = user.watchlist.indexOf(symbol.toUpperCase());

        if (index > -1) {
            user.watchlist.splice(index, 1); // Remove
        } else {
            user.watchlist.push(symbol.toUpperCase()); // Add
        }

        await user.save();
        res.status(200).json({
            success: true,
            data: user.watchlist,
        });
    } catch (err) {
        throw err;
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
        });
};

