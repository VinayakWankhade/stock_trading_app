import React, { useState, useEffect } from 'react';
import { useGeneral } from '../context/GeneralContext';
import { useSocket } from '../context/SocketContext';
import axios from '../components/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Activity, ChevronRight, Star, Wallet, Newspaper, Clock, ArrowUpRight, Globe, Zap, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';

const Home = () => {
    const { user, loadUser } = useGeneral();
    const { prices } = useSocket();
    const [searchTerm, setSearchTerm] = useState('');
    const [portfolioStats, setPortfolioStats] = useState({ totalValue: 0, dayChange: 0, dayChangePercent: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [news, setNews] = useState([
        { id: 1, title: 'Federal Reserve Hints at Final Rate Hike of 2026', source: 'Bloomberg', time: '12m ago', impact: 'High' },
        { id: 2, title: 'Tech Giants Rally as AI Infrastructure Demand Surges', source: 'Reuters', time: '1h ago', impact: 'Moderate' },
        { id: 3, title: 'Oil Prices Stabilize After Global Supply Disruption Fears', source: 'CNBC', time: '3h ago', impact: 'Neutral' }
    ]);
    const [movers, setMovers] = useState({ gainers: [], losers: [] });
    const [poll, setPoll] = useState({ bullish: 68, bearish: 32, userVoted: false });
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/stock/${searchTerm.trim().toUpperCase()}`);
        }
    };

    const getCompanyName = (symbol) => {
        const map = { AAPL: 'Apple Inc.', TSLA: 'Tesla, Inc.', MSFT: 'Microsoft Corp.', GOOGL: 'Alphabet Inc.', AMZN: 'Amazon.com', NFLX: 'Netflix, Inc.', META: 'Meta Platforms' };
        return map[symbol] || symbol;
    };

    const getChange = (price) => {
        const isPositive = price < 300;
        const percent = (Math.random() * 3 + 0.1).toFixed(2);
        return { isPositive, percent };
    };

    if (!user) return null;

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [portRes, histRes] = await Promise.all([
                    axios.get('/portfolio'),
                    axios.get('/user/funds/history')
                ]);

                const holdings = portRes.data.data.holdings;
                let totalValue = 0;
                holdings.forEach(h => {
                    const price = prices[h.ticker] || h.currentPrice || 0;
                    totalValue += (h.quantity * price);
                });

                const change = (totalValue * 0.024).toFixed(2);
                setPortfolioStats({
                    totalValue,
                    dayChange: parseFloat(change),
                    dayChangePercent: 2.41
                });

                setRecentActivity(histRes.data.data.slice(0, 3));

                // Calculate Movers
                const allMovers = Object.entries(prices).map(([symbol, price]) => {
                    const { isPositive, percent } = getChange(price);
                    return { symbol, price, isPositive, percent: parseFloat(percent) };
                });

                setMovers({
                    gainers: allMovers.filter(m => m.isPositive).sort((a, b) => b.percent - a.percent).slice(0, 3),
                    losers: allMovers.filter(m => !m.isPositive).sort((a, b) => b.percent - a.percent).slice(0, 3)
                });
            } catch (err) {
                console.error("Home data fetch error:", err);
            }
        };
        if (Object.keys(prices).length > 0) fetchHomeData();
    }, [prices]);

    const handleVote = (type) => {
        if (poll.userVoted) return;
        setPoll(prev => ({
            ...prev,
            bullish: type === 'bull' ? prev.bullish + 1 : prev.bullish,
            bearish: type === 'bear' ? prev.bearish + 1 : prev.bearish,
            userVoted: true
        }));
    };

    return (
        <>
            {/* Global Market Ticker */}
            <div className="ticker-container">
                <div className="ticker-wrapper">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} style={{ display: 'flex' }}>
                            <div className="ticker-item"><Globe size={14} /> GLOBAL MARKETS:</div>
                            <div className="ticker-item">S&P 500 <span style={{ color: 'var(--success)', fontWeight: '800' }}>5,123.42 (+0.82%)</span></div>
                            <div className="ticker-item">NASDAQ <span style={{ color: 'var(--success)', fontWeight: '800' }}>16,274.94 (+1.14%)</span></div>
                            <div className="ticker-item">BTC/USD <span style={{ color: 'var(--danger)', fontWeight: '800' }}>$67,432.10 (-1.24%)</span></div>
                            <div className="ticker-item">GOLD <span style={{ color: 'var(--success)', fontWeight: '800' }}>$2,184.20 (+0.45%)</span></div>
                            <div className="ticker-item">ETH/USD <span style={{ color: 'var(--danger)', fontWeight: '800' }}>$3,842.15 (-0.85%)</span></div>
                            <div className="ticker-item">10Y TREASURY <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>4.124% (0.00%)</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="animate-fade-in" style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Executive Summary Bar */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem',
                    background: 'var(--bg-secondary)',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Portfolio Net Worth</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>$ {portfolioStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Today's Performance</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--success)' }}>+${portfolioStats.dayChange.toLocaleString()}</h2>
                            <span style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700' }}>
                                +{portfolioStats.dayChangePercent}%
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'right', background: 'var(--bg-primary)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>Buying Power</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <Wallet size={16} color="var(--accent-primary)" />
                                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>$ {user.balance?.toLocaleString()}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', background: 'var(--bg-primary)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>Market Status</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                                <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>OPEN</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif'
                        }}>
                            Discover Markets
                        </h2>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '0.75rem 1.25rem',
                        width: '380px',
                        transition: 'all 0.2s ease'
                    }} className="search-focus-ring">
                        <Search size={20} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
                        <input
                            type="text"
                            placeholder="Search for symbols (e.g. AAPL)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                width: '100%',
                                outline: 'none',
                                fontSize: '0.95rem',
                                color: 'var(--text-primary)',
                                fontWeight: '500'
                            }}
                        />
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    {/* Global Intelligence Strip (Horizontal Scroll) */}
                    <section style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        padding: '0.5rem 0.5rem 1.5rem',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }} className="no-scrollbar">

                        {/* Trending Now */}
                        <div className="pro-card" style={{ minWidth: '350px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Activity size={20} color="var(--accent-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Trending Now</h2>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }} className="custom-scrollbar">
                                {Object.entries(prices).slice(0, 10).map(([symbol, price]) => {
                                    const { isPositive, percent } = getChange(price);
                                    return (
                                        <Link to={`/stock/${symbol}`} key={symbol} style={{ textDecoration: 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>{symbol.charAt(0)}</div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{symbol}</span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>${price.toFixed(2)}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isPositive ? 'var(--success)' : 'var(--danger)' }}>{isPositive ? '+' : '-'}{percent}%</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="pro-card" style={{ minWidth: '350px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Clock size={20} color="#6366f1" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Recent Activity</h2>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar">
                                {recentActivity.length > 0 ? recentActivity.map((act) => (
                                    <div key={act._id} style={{ padding: '0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ background: act.type === 'deposit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '6px' }}>
                                                {act.type === 'deposit' ? <TrendingUp size={14} color="var(--success)" /> : <TrendingDown size={14} color="var(--danger)" />}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{act.type.toUpperCase()}</p>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '800', color: act.type === 'deposit' ? 'var(--success)' : 'var(--danger)', fontSize: '0.8rem' }}>${act.amount}</p>
                                    </div>
                                )) : <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No activity</p>}
                            </div>
                            <Link to="/profile" style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6366f1', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>VIEW ALL HISTORY →</Link>
                        </div>

                        {/* Market Narratives */}
                        <div className="pro-card" style={{ minWidth: '400px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Newspaper size={20} color="#ec4899" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Market Narratives</h2>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="custom-scrollbar">
                                {news.map((item) => (
                                    <div key={item.id} style={{ padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--accent-primary)', background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>{item.source}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.time}</span>
                                        </div>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>{item.title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: '700', color: item.impact === 'High' ? '#ef4444' : '#f59e0b' }}>
                                            <Activity size={10} /> {item.impact} Impact
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Market Movers */}
                        <div className="pro-card" style={{ minWidth: '350px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Zap size={20} color="var(--accent-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Market Movers</h2>
                            </div>
                            <div className="movers-grid" style={{ gap: '0.75rem' }}>
                                <div style={{ background: 'rgba(5, 150, 105, 0.05)', padding: '0.75rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                                    {movers.gainers.slice(0, 5).map(m => (
                                        <div key={m.symbol} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{m.symbol}</span>
                                            <span style={{ fontWeight: '800', color: 'var(--success)' }}>+{m.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'rgba(220, 38, 38, 0.05)', padding: '0.75rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
                                    {movers.losers.slice(0, 5).map(m => (
                                        <div key={m.symbol} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{m.symbol}</span>
                                            <span style={{ fontWeight: '800', color: 'var(--danger)' }}>-{m.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Economic Calendar */}
                        <div className="pro-card" style={{ minWidth: '350px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Calendar size={20} color="var(--accent-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Calendar</h2>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                                {[
                                    { event: 'CPI Data Release', date: 'Mar 12', time: '08:30 EST', impact: 'High' },
                                    { event: 'FOMC Statement', date: 'Mar 20', time: '14:00 EST', impact: 'High' },
                                    { event: 'Retail Sales', date: 'Mar 15', time: '08:30 EST', impact: 'Moderate' },
                                    { event: 'Jobless Claims', date: 'Mar 14', time: '08:30 EST', impact: 'Moderate' }
                                ].map((e, idx) => (
                                    <div key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{e.event}</p>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{e.date} • {e.time}</p>
                                        </div>
                                        <div className="pulse-dot" style={{ background: e.impact === 'High' ? 'var(--danger)' : 'var(--text-secondary)' }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Community Pulse */}
                        <div className="pro-card" style={{ minWidth: '350px', height: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <ThumbsUp size={20} color="var(--accent-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Community Pulse</h2>
                            </div>
                            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem', textAlign: 'center' }}>Overall market sentiment for the next 24 hours?</p>
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <button onClick={() => handleVote('bull')} disabled={poll.userVoted} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: poll.userVoted === 'bull' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', cursor: poll.userVoted ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <ThumbsUp size={16} color="var(--success)" /> <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--success)' }}>BULLISH</span>
                                    </button>
                                    <button onClick={() => handleVote('bear')} disabled={poll.userVoted} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: poll.userVoted === 'bear' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)', cursor: poll.userVoted ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <ThumbsDown size={16} color="var(--danger)" /> <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--danger)' }}>BEARISH</span>
                                    </button>
                                </div>
                                {poll.userVoted && <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: '800' }}>VOTE RECORDED: {poll.bullish}% BULL / {poll.bearish}% BEAR</p>}
                            </div>
                        </div>
                    </section>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>

                    </div>

                    {/* Right Main Content: Watchlist */}
                    <main>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Star size={22} color="var(--accent-primary)" fill="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Your Watchlist</h2>
                        </div>

                        <div className="pro-card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                            {user.watchlist && user.watchlist.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asset</th>
                                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>24h Change</th>
                                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Market</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.watchlist.map((symbol, i, arr) => {
                                            const price = prices[symbol] || 0;
                                            const { isPositive, percent } = getChange(price);

                                            return (
                                                <tr
                                                    key={symbol}
                                                    onClick={() => navigate(`/stock/${symbol}`)}
                                                    style={{
                                                        borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border-light)',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <div style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '50%',
                                                                background: 'var(--accent-primary)',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: '700',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                {symbol.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{symbol}</p>
                                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>{getCompanyName(symbol)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                                                            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </p>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            color: isPositive ? 'var(--success)' : 'var(--danger)',
                                                            background: isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                            {isPositive ? '+' : '-'}{percent}%
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
                                                            NASDAQ
                                                            <ChevronRight size={16} color="#cbd5e1" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                    <Star size={48} color="var(--border-light)" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Your watchlist is empty</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.6 }}>Search for stocks and click the ★ star icon to track your favorites here.</p>
                                </div>
                            )}
                        </div>

                        {/* Featured Insights Section (New) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '3rem 0 1.5rem' }}>
                            <TrendingUp size={22} color="var(--success)" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Market Sentiment Engine</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="pro-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Retail Sentiment</p>
                                    <ArrowUpRight size={18} color="var(--success)" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)', margin: '0 0 0.5rem 0' }}>Extremely Bullish</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Heavy accumulation observed across semiconductor and EV sectors.</p>
                            </div>
                            <div className="pro-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Volatility Index (VIX)</p>
                                    <Activity size={18} color="var(--danger)" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)', margin: '0 0 0.5rem 0' }}>18.42 (+4.2%)</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Increased caution as CPI data release approaches this Thursday.</p>
                            </div>
                        </div>
                    </main>
                </div>

                <style jsx="true">{`
                .search-focus-ring:focus-within {
                    border-color: var(--accent-primary) !important;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
                }
            `}</style>
            </div>
        </>
    );
};

export default Home;

