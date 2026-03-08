const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const userRoute = require('./routes/userRoute');
const stockRoute = require('./routes/stockRoute');
const transactionRoute = require('./routes/transactionRoute');
const portfolioRoute = require('./routes/portfolioRoute');
const orderRoute = require('./routes/orderRoute');

const app = express();
const http = require('http');
const server = http.createServer(app);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ── CORS must be the VERY FIRST middleware ──────────────────────────
// Handles preflight OPTIONS before helmet, routes, or anything else
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200  // Some browsers (IE11) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle ALL preflight requests

// Security Middlewares (after CORS)
app.use(helmet({
    crossOriginResourcePolicy: false,  // Don't block cross-origin resources
    crossOriginOpenerPolicy: false
}));


// Mount routers
app.use('/api/user', userRoute);
app.use('/api/stock', stockRoute);
app.use('/api/stocks', stockRoute); // Plural support
app.use('/api/transaction', transactionRoute);
app.use('/api/transactions', transactionRoute); // Plural support
app.use('/api/portfolio', portfolioRoute);
app.use('/api/order', orderRoute);
app.use('/api/admin', require('./routes/adminRoute'));

const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Basic Test Route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'SB Stocks API is running...' });
});

const PORT = process.env.PORT || 5000;

const axios = require('axios');

// Socket.io Setup
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Real-time Market Data Engine (Finnhub)
const stocks = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'NFLX', 'META', 'NVDA'];
const prices = {
    AAPL: 250.00,
    GOOGL: 300.00,
    AMZN: 200.00,
    MSFT: 400.00,
    TSLA: 400.00,
    NFLX: 100.00,
    META: 650.00,
    NVDA: 180.00
};

const fetchMarketData = async () => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const isMock = !apiKey || apiKey.includes('your_finnhub_api_key');

    console.log(`[MarketData] Fetching data (Mode: ${isMock ? 'SIMULATED' : 'LIVE API'})`);
    if (apiKey) console.log(`[MarketData] API Key Length: ${apiKey.length}`);

    try {
        if (isMock) {
            stocks.forEach(s => {
                const change = (Math.random() - 0.5) * 2.5;
                prices[s] = Math.max(1, (prices[s] || 150 + Math.random() * 300) + change);
            });
        } else {
            for (const symbol of stocks) {
                try {
                    const res = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                    if (res.data && res.data.c !== 0) {
                        const vibration = (Math.random() - 0.5) * (res.data.c * 0.0001);
                        prices[symbol] = res.data.c + vibration;
                        // console.log(`[MarketData] ${symbol}: $${prices[symbol].toFixed(2)}`);
                    }
                } catch (retryErr) {
                    if (retryErr.response?.status === 429) {
                        console.warn(`[MarketData] Rate limit hit for ${symbol}, keeping last price: $${prices[symbol]?.toFixed(2)}`);
                    } else if (retryErr.response?.status === 401) {
                        console.error(`[MarketData] API Key Unauthorized (401). Check .env key: ${apiKey}`);
                    } else {
                        console.error(`[MarketData] Error for ${symbol}:`, retryErr.message);
                    }
                }
                await new Promise(r => setTimeout(r, 200));
            }
        }
        io.emit('priceUpdate', prices);
    } catch (err) {
        console.error('[MarketData] Global Fetch Error:', err.message);
    }
};

setInterval(fetchMarketData, 20000);
fetchMarketData();

io.on('connection', (socket) => {
    console.log('--- NEW CLIENT CONNECTED ---');
    console.log('ID:', socket.id);

    socket.emit('priceUpdate', prices);

    socket.on('disconnect', (reason) => {
        console.log('--- CLIENT DISCONNECTED --- ID:', socket.id, 'Reason:', reason);
    });
});

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
