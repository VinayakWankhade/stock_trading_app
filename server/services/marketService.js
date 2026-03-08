const axios = require('axios');

/**
 * Service to fetch stock data from Finnhub API
 */
class MarketService {
    constructor() {
        this.apiKey = process.env.FINNHUB_API_KEY;
        this.baseUrl = 'https://finnhub.io/api/v1';
    }

    /**
     * Get real-time quote for a ticker
     * @param {string} ticker 
     */
    async getQuote(ticker) {
        try {
            const response = await axios.get(`${this.baseUrl}/quote`, {
                params: {
                    symbol: ticker,
                    token: this.apiKey,
                },
            });

            // Finnhub returns c (current price), d (change), dp (percent change), h (high), l (low), o (open), pc (previous close)
            if (response.data.c === 0 && response.data.t === 0) {
                console.warn(`[MarketService] No real quote data for ${ticker}, using simulated price`);
                return this.generateMockQuote(ticker);
            }

            return {
                price: response.data.c,
                change: response.data.d,
                percentChange: response.data.dp,
                high: response.data.h,
                low: response.data.l,
                open: response.data.o,
                previousClose: response.data.pc,
                timestamp: response.data.t,
            };
        } catch (error) {
            console.warn(`[MarketService] Finnhub Quote Error for ${ticker} (using mock): ${error.message}`);
            return this.generateMockQuote(ticker);
        }
    }

    generateMockQuote(ticker) {
        // Stable simulated prices per ticker for consistency
        const basePrices = {
            AAPL: 265, GOOGL: 307, AMZN: 208, MSFT: 399,
            TSLA: 403, NFLX: 97, META: 653, NVDA: 182,
        };
        const base = basePrices[ticker] || 150 + Math.random() * 200;
        const price = base + (Math.random() - 0.5) * 2;
        return {
            price: parseFloat(price.toFixed(2)),
            change: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
            percentChange: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
            high: parseFloat((price * 1.01).toFixed(2)),
            low: parseFloat((price * 0.99).toFixed(2)),
            open: parseFloat((price * 0.995).toFixed(2)),
            previousClose: parseFloat((price * 0.998).toFixed(2)),
            timestamp: Math.floor(Date.now() / 1000),
        };
    }

    /**
     * Get company profile
     * @param {string} ticker 
     */
    async getProfile(ticker) {
        try {
            const response = await axios.get(`${this.baseUrl}/stock/profile2`, {
                params: {
                    symbol: ticker,
                    token: this.apiKey,
                },
            });

            if (!response.data || Object.keys(response.data).length === 0) {
                return { name: `${ticker} (Mock Asset)`, logo: '', ticker: ticker };
            }

            return response.data;
        } catch (error) {
            console.error(`Finnhub Profile Error for ${ticker}:`, error.message);
            return { name: `${ticker} (Mock Asset)`, logo: '', ticker: ticker };
        }
    }

    /**
     * Get stock candles (historical data)
     * @param {string} ticker 
     * @param {string} resolution 
     * @param {number} from 
     * @param {number} to 
     */
    async getCandles(ticker, resolution = 'D', from, to) {
        try {
            const response = await axios.get(`${this.baseUrl}/stock/candle`, {
                params: {
                    symbol: ticker,
                    resolution,
                    from,
                    to,
                    token: this.apiKey,
                },
            });

            if (response.data.s === 'no_data' || !response.data.t) {
                return this.generateMockCandles();
            }

            const candles = response.data.t.map((time, i) => ({
                time: time,
                open: response.data.o[i],
                high: response.data.h[i],
                low: response.data.l[i],
                close: response.data.c[i],
                volume: response.data.v[i],
            }));

            return candles;
        } catch (error) {
            console.warn(`Finnhub Candle Error for ${ticker} (using mock):`, error.message);
            return this.generateMockCandles();
        }
    }

    generateMockCandles() {
        const candles = [];
        // Use a consistent midnight UTC timestamp for daily bars
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        let currentTimestamp = Math.floor(now.getTime() / 1000);

        let lastPrice = 200 + Math.random() * 100;

        for (let i = 30; i >= 0; i--) {
            // Subtract i days in seconds
            const time = currentTimestamp - (i * 24 * 60 * 60);

            const open = lastPrice;
            const close = open + (Math.random() - 0.5) * 10;
            const high = Math.max(open, close) + Math.random() * 5;
            const low = Math.min(open, close) - Math.random() * 5;

            candles.push({
                time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: Math.floor(1000 + Math.random() * 5000)
            });
            lastPrice = close;
        }
        return candles;
    }
}

module.exports = new MarketService();
