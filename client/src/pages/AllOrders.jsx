import React, { useEffect, useState } from 'react';
import axios from '../components/axiosInstance';
import { ShoppingBag, Search, Filter, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/admin/orders');
                setOrders(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Execution Nexus</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Global stream of all system-wide market liquidity and order flows.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', padding: '0.75rem 1.5rem',
                        borderRadius: '12px', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s',
                        textTransform: 'uppercase', letterSpacing: '0.5px'
                    }} onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>
                        <Filter size={16} /> Filter nexus
                    </button>
                    <button style={{
                        background: 'var(--accent-primary)', border: 'none', padding: '0.75rem 1.5rem',
                        borderRadius: '12px', color: 'white', fontWeight: '800', fontSize: '0.8rem',
                        cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px'
                    }} onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        Export Ledger
                    </button>
                </div>
            </div>

            <div className="pro-card" style={{
                background: 'var(--bg-secondary)',
                borderRadius: '24px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution ID</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entity Ref</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Instrument</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Direction</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Volume</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Valuation</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Integrity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Generating data report...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                                    <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: '0.1' }} />
                                    <p style={{ fontWeight: '600' }}>No market orders found in system records.</p>
                                </td>
                            </tr>
                        ) : (
                            orders.map((o, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                        #{o._id?.slice(-8).toUpperCase() || 'TX-N/A'}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}><Search size={14} color="var(--accent-primary)" /></div>
                                            <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.8rem' }}>{o.user?.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div>
                                            <div style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1.05rem', letterSpacing: '-0.5px' }}>{o.ticker}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>{o.name || 'Equity Asset'}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            background: 'var(--bg-primary)',
                                            color: o.type === 'buy' ? 'var(--success)' : 'var(--danger)',
                                            padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900',
                                            textTransform: 'uppercase', border: '1px solid var(--border-light)', letterSpacing: '0.5px'
                                        }}>
                                            {o.type === 'buy' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />} {o.type === 'buy' ? 'LONG' : 'SHORT'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '800', fontSize: '1rem' }}>
                                        {o.quantity}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>$ {o.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>$ {o.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })} VAL</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            <CheckCircle2 size={16} /> Verified
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrders;
