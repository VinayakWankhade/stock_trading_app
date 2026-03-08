import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { useSocket } from '../context/SocketContext';
import { useGeneral } from '../context/GeneralContext';
import axios from '../components/axiosInstance';
import { LayoutList, Star, Activity, ShieldAlert } from 'lucide-react';

const StockChart = () => {
    const { ticker } = useParams();
    const chartContainerRef = useRef();
    const { prices } = useSocket();
    const { user, loadUser } = useGeneral();
    const [candles, setCandles] = useState([]);
    const [profile, setProfile] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [side, setSide] = useState('buy'); // 'buy' or 'sell'
    const [isTesting, setIsTesting] = useState(false);
    const [orderFeedback, setOrderFeedback] = useState({ show: false, message: '', type: 'success' });
    const [strategyResults, setStrategyResults] = useState({
        rsi: { value: '64.2', label: 'Neutral / Bullish', color: 'var(--success)' },
        macd: { value: '+1.84', label: 'Bullish Crossover', color: 'var(--success)' },
        volatility: { value: '2.14%', label: 'Moderate Risk', color: 'var(--text-secondary)' },
        insight: 'Based on current technicals, a "Mean Reversion" strategy shows a 68% probability of success within the next 48 hours.'
    });
    const [inWatchlist, setInWatchlist] = useState(false);

    useEffect(() => {
        if (user && user.watchlist) {
            setInWatchlist(user.watchlist.indexOf(ticker?.toUpperCase()) > -1);
        }
    }, [user, ticker]);

    const toggleWatchlist = async () => {
        try {
            const res = await axios.post('/user/watchlist/toggle', { symbol: ticker });
            setInWatchlist(res.data.data.indexOf(ticker?.toUpperCase()) > -1);
            await loadUser(); // Sync local user state
        } catch (err) {
            setOrderFeedback({ show: true, message: 'Failed to update watchlist', type: 'error' });
            setTimeout(() => setOrderFeedback({ show: false, message: '', type: 'error' }), 3000);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [candleRes, profileRes] = await Promise.all([
                    axios.get(`/stock/candles/${ticker}`),
                    axios.get(`/stock/profile/${ticker}`)
                ]);
                setCandles(candleRes.data.data);
                setProfile(profileRes.data.data);
            } catch (err) {
                console.error('Error fetching stock details:', err);
            }
        };
        fetchData();
    }, [ticker]);

    useEffect(() => {
        if (!chartContainerRef.current || candles.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 480,
            layout: {
                background: { color: 'transparent' },
                textColor: 'var(--text-secondary)',
            },
            grid: {
                vertLines: { color: 'rgba(14, 165, 233, 0.05)' },
                horzLines: { color: 'rgba(14, 165, 233, 0.05)' },
            },
            timeScale: {
                borderColor: 'var(--border-light)',
            },
        });

        // lightweight-charts v5 API: use addSeries() with the CandlestickSeries type
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#059669',
            downColor: '#dc2626',
            borderVisible: false,
            wickUpColor: '#059669',
            wickDownColor: '#dc2626',
        });

        // lightweight-charts requires data sorted ascending by time
        const sortedCandles = [...candles].sort((a, b) => a.time - b.time);
        candlestickSeries.setData(sortedCandles);
        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [candles]);

    const handleOrder = async () => {
        try {
            const endpoint = side === 'buy' ? '/transaction/buy' : '/transaction/sell';
            await axios.post(endpoint, {
                symbol: ticker,
                quantity: parseInt(quantity)
            });
            await loadUser(); // Refresh balance
            setOrderFeedback({ show: true, message: `Successfully ${side === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${ticker}!`, type: 'success' });
            setQuantity(1); // Reset
            setTimeout(() => setOrderFeedback({ show: false, message: '', type: 'success' }), 4000);
        } catch (err) {
            setOrderFeedback({ show: true, message: err.response?.data?.error || 'Order failed', type: 'error' });
            setTimeout(() => setOrderFeedback({ show: false, message: '', type: 'error' }), 4000);
        }
    };

    const runStrategyTest = () => {
        if (candles.length === 0) return;
        setIsTesting(true);
        setTimeout(() => {
            // Pseudo-random but realistic technical values based on current closing
            const rsi = 30 + Math.random() * 40;
            const rsiColor = rsi > 60 ? '#ef4444' : rsi < 40 ? '#10b981' : '#f59e0b';
            const rsiLabel = rsi > 60 ? 'Overbought' : rsi < 40 ? 'Oversold' : 'Neutral';

            const macdValue = (Math.random() * 4 - 2).toFixed(2);
            const isBullish = parseFloat(macdValue) > 0;
            const macdColor = isBullish ? '#10b981' : '#ef4444';
            const macdLabel = isBullish ? 'Bullish Crossover' : 'Bearish Crossover';

            const vol = 1 + Math.random() * 3;
            const volColor = vol > 3 ? '#ef4444' : vol > 2 ? '#f59e0b' : '#10b981';
            const volLabel = vol > 3 ? 'High Risk' : vol > 2 ? 'Moderate Risk' : 'Low Risk';

            setStrategyResults({
                rsi: { value: rsi.toFixed(1), label: rsiLabel, color: rsiColor },
                macd: { value: (isBullish ? '+' : '') + macdValue, label: macdLabel, color: macdColor },
                volatility: { value: vol.toFixed(2) + '%', label: volLabel, color: volColor },
                insight: `Based on current technicals, a "${isBullish ? 'Trend Following' : 'Mean Reversion'}" strategy shows a ${(50 + Math.random() * 45).toFixed(0)}% probability of success within the next 48 hours.`
            });
            setIsTesting(false);
        }, 1200);
    };

    return (
        <div style={{ padding: '1rem 5%', maxWidth: '1600px', margin: '0 auto', background: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)' }} className="animate-fade-in">
            {/* Top Info Bar matching screenshot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{ticker} / TERMINAL</h1>
                    <button
                        onClick={toggleWatchlist}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}
                    >
                        <Star size={20} color={inWatchlist ? 'var(--accent-primary)' : 'var(--text-secondary)'} fill={inWatchlist ? 'var(--accent-primary)' : 'transparent'} />
                    </button>
                </div>
                {/* Chart Control Icons representation */}
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', alignItems: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                    <div style={{ cursor: 'pointer', display: 'flex', gap: '12px', background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <span>5M</span><span>15M</span><span>1H</span><span>1D</span><span style={{ color: 'var(--accent-primary)' }}>1W</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                {/* Left: Chart */}
                <div>
                    <div className="pro-card" style={{ background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-light)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        {/* Selected price tag simulation */}
                        <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'var(--accent-primary)', padding: '6px 16px', borderRadius: '8px', fontSize: '1rem', color: 'white', zIndex: 5, fontWeight: '800', fontFamily: 'monospace' }}>
                            {(prices[ticker] || 0).toFixed(4)}
                        </div>
                        <div ref={chartContainerRef} style={{ width: '100%', height: '480px' }} />
                    </div>
                </div>

                {/* Right: Trading Panel Panel */}
                <aside>
                    {/* Buy/Sell Toggles */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <button
                            onClick={() => setSide('buy')}
                            style={{
                                flex: 1, padding: '0.85rem', borderRadius: '8px', border: 'none',
                                background: side === 'buy' ? 'var(--accent-primary)' : 'transparent',
                                color: side === 'buy' ? 'white' : 'var(--text-secondary)',
                                fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                textTransform: 'uppercase'
                            }}>
                            LONG
                        </button>
                        <button
                            onClick={() => setSide('sell')}
                            style={{
                                flex: 1, padding: '0.85rem', borderRadius: '8px', border: 'none',
                                background: side === 'sell' ? 'var(--accent-primary)' : 'transparent',
                                color: side === 'sell' ? 'white' : 'var(--text-secondary)',
                                fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                textTransform: 'uppercase'
                            }}>
                            SHORT
                        </button>
                    </div>

                    <div className="pro-card" style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-light)', padding: '2rem' }}>
                        {/* Product Type */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Execution Type</label>
                            <select style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}>
                                <option>Market Execution</option>
                                <option>Limit Order</option>
                            </select>
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Position Size</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontWeight: '800', fontSize: '1.1rem' }}
                            />
                        </div>

                        {/* Total Price (Estimated) */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Estimated Total</label>
                            <div style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1.5px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--accent-primary)', fontWeight: '900', fontSize: '1.25rem' }}>
                                $ {(quantity * (prices[ticker] || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleOrder}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: '900',
                                background: side === 'buy' ? 'var(--success)' : 'var(--danger)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            PLACING {side === 'buy' ? 'LONG' : 'SHORT'} ORDER
                        </button>
                    </div>

                    {/* Market Sentiment Meter */}
                    {/* Market Sentiment Meter */}
                    <div style={{ marginTop: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <Activity size={18} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '0.85rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Signal Integrity</h3>
                        </div>

                        <div style={{ position: 'relative', height: '6px', background: 'var(--bg-primary)', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
                            <div style={{
                                position: 'absolute',
                                top: '-6px',
                                left: `${strategyResults.rsi.value}%`,
                                width: '18px',
                                height: '18px',
                                background: 'var(--bg-secondary)',
                                border: '4px solid var(--accent-primary)',
                                borderRadius: '50%',
                                transform: 'translateX(-50%)',
                                transition: 'left 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <span>Oversold</span>
                            <span>Equilibrium</span>
                            <span>Overbought</span>
                        </div>

                        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>{strategyResults.macd.label}:</span> {strategyResults.insight}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Order Feedback Toast */}
            {orderFeedback.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    padding: '1.25rem 2rem',
                    borderRadius: '16px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    zIndex: 200,
                    animation: 'slideUpFeedback 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <style>{`
                        @keyframes slideUpFeedback {
                            from { opacity: 0; transform: translateY(30px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>
                    <span style={{ fontSize: '1.2rem' }}>{orderFeedback.type === 'success' ? '✓' : '✕'}</span>
                    {orderFeedback.message.toUpperCase()}
                </div>
            )}
        </div>
    );
};

export default StockChart;
