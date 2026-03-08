import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axiosInstance';
import { useSocket } from '../context/SocketContext';
import { Search, TrendingUp, TrendingDown, PieChart, Info, ArrowUpRight } from 'lucide-react';

const Portfolio = () => {
    const { prices } = useSocket();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalValue: 0, totalCost: 0, totalPL: 0, plPercent: 0 });

    const fetchPortfolio = async () => {
        try {
            const res = await axios.get('/portfolio');
            setPortfolio(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    useEffect(() => {
        if (portfolio && Object.keys(prices).length > 0) {
            let value = 0;
            let cost = 0;
            portfolio.holdings.forEach(h => {
                const currentPrice = prices[h.ticker] || h.currentPrice || 0;
                value += h.quantity * currentPrice;
                cost += h.quantity * (h.averagePrice || h.price || 0);
            });
            const pl = value - cost;
            const percent = cost > 0 ? (pl / cost) * 100 : 0;
            setStats({ totalValue: value, totalCost: cost, totalPL: pl, plPercent: percent });
        }
    }, [portfolio, prices]);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontSize: '1.2rem' }}>Reconciling portfolio data...</div>;

    // SVG Doughnut Chart Calculation
    const getDoughnutData = () => {
        if (!portfolio || portfolio.holdings.length === 0) return null;
        const total = stats.totalValue;
        let cumulativePercent = 0;
        const colors = ['var(--accent-primary)', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185'];

        return portfolio.holdings.map((h, i) => {
            const currentPrice = prices[h.ticker] || h.currentPrice || 0;
            const value = h.quantity * currentPrice;
            const percent = (value / total) * 100;
            const startAngle = (cumulativePercent / 100) * 360;
            cumulativePercent += percent;
            return {
                ticker: h.ticker,
                percent,
                color: colors[i % colors.length],
                startAngle
            };
        });
    };

    const chartData = getDoughnutData();

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Portfolio Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Detailed breakdown of your asset allocation and performance.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0 }}>Total ROI</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: '800', color: stats.totalPL >= 0 ? 'var(--success)' : 'var(--danger)', margin: 0 }}>
                            {stats.totalPL >= 0 ? '+' : ''}{stats.plPercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem', marginBottom: '3rem' }}>
                {/* Analytics Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="pro-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Current Equity</span>
                            <PieChart size={20} color="var(--accent-primary)" />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>$ {stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Invested Capital: $ {stats.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="pro-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Unrealized P/L</span>
                            {stats.totalPL >= 0 ? <TrendingUp size={20} color="var(--success)" /> : <TrendingDown size={20} color="var(--danger)" />}
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: stats.totalPL >= 0 ? 'var(--success)' : 'var(--danger)', margin: 0 }}>
                            {stats.totalPL >= 0 ? '+' : '-'}$ {Math.abs(stats.totalPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '0.5rem' }}>
                            <span style={{
                                background: stats.totalPL >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: stats.totalPL >= 0 ? 'var(--success)' : 'var(--danger)',
                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700'
                            }}>
                                {stats.totalPL >= 0 ? 'Surplus' : 'Deficit'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Allocation Chart */}
                <div className="pro-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '1.5rem' }}>
                        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            {chartData && chartData.map((d, i) => (
                                <circle
                                    key={i}
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke={d.color}
                                    strokeWidth="15"
                                    strokeDasharray={`${d.percent * 2.513} 251.3`}
                                    strokeDashoffset={-(d.startAngle * 2.513 / 3.6)}
                                />
                            ))}
                            <circle cx="50" cy="50" r="28" fill="var(--bg-secondary)" />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0 }}>Allocation</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{portfolio?.holdings.length} Assets</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                        {chartData && chartData.slice(0, 4).map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{d.ticker}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pro-card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Holding</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Qty</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Avg Cost / Mkt Price</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Net Value</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Performance (P/L)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!portfolio || portfolio.holdings.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>No active holdings in your account.</td></tr>
                        ) : (
                            portfolio.holdings.map((h, i) => {
                                const currentPrice = prices[h.ticker] || h.currentPrice || 0;
                                const avgPrice = h.averagePrice || h.price || 0;
                                const value = h.quantity * currentPrice;
                                const cost = h.quantity * avgPrice;
                                const pl = value - cost;
                                const plPerc = cost > 0 ? (pl / cost) * 100 : 0;

                                return (
                                    <tr key={i} onClick={() => navigate(`/stock/${h.ticker}`)} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '1px solid var(--border-light)' }}>{h.ticker.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{h.ticker}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{h.name || 'Equity'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'center', fontWeight: '700', color: 'var(--text-primary)' }}>{h.quantity}</td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Avg: $ {avgPrice.toFixed(2)}</div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Now: $ {currentPrice.toLocaleString()}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: '800', color: 'var(--text-primary)' }}>$ {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <div style={{ color: pl >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                {pl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                $ {Math.abs(pl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: pl >= 0 ? 'var(--success)' : 'var(--danger)' }}>{pl >= 0 ? '+' : ''}{plPerc.toFixed(2)}%</div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Portfolio;
