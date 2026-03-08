import React, { useEffect, useState } from 'react';
import axios from '../components/axiosInstance';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get('/portfolio/transactions');
                setTransactions(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Order History</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Full audit trail of your market and limit executions.</p>
            </div>

            <div className="pro-card" style={{ padding: '0', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Type</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Asset Name</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Ticker</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Action</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Qty</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Execution Price</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Total Capital</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center' }}>Loading orders...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    <HistoryIcon size={48} style={{ marginBottom: '1rem', opacity: '0.1' }} />
                                    <p>No orders found.</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t, i) => (
                                <tr key={i} style={{ borderBottom: i === transactions.length - 1 ? 'none' : '1px solid var(--border-medium)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            background: 'var(--bg-light-blue)',
                                            color: 'var(--text-on-light-blue)',
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            border: '1px solid var(--border-light)',
                                            textTransform: 'uppercase'
                                        }}>
                                            Intraday
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        {t.name || 'NVIDIA Corporation'}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                                        {t.ticker}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        {t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase()}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                                        {t.quantity}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                        $ {t.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                                        $ {t.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--success)', fontWeight: '800', textTransform: 'uppercase' }}>
                                        Executed
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

export default History;
