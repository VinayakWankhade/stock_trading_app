import React, { useEffect, useState } from 'react';
import axios from '../components/axiosInstance';
import { History as HistoryIcon, Download, Upload, Clock, DollarSign, ArrowRight } from 'lucide-react';

const AllTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get('/admin/funds');
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
        <div style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Capital Audit</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Institutional ledger of all system-wide capital injections and extractions.</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem 2rem', borderRadius: '20px', border: '1.5px solid var(--border-light)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>INSTITUTIONAL LIQUIDITY</div>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-1px' }}>$ {transactions.reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0).toLocaleString()}</div>
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
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Audit Ref</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entity ID</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Vector</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Magnitude</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Gateway</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Reconciling financial records...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                                    <HistoryIcon size={48} style={{ marginBottom: '1rem', opacity: '0.1' }} />
                                    <p style={{ fontWeight: '600' }}>No financial transactions identified.</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t._id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: '600' }}>
                                        #{t._id.slice(-10).toUpperCase()}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem' }}>
                                        {t.user.slice(-8).toUpperCase()}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            background: 'var(--bg-primary)',
                                            color: t.type === 'deposit' ? 'var(--success)' : 'var(--danger)',
                                            padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900',
                                            textTransform: 'uppercase', border: '1px solid var(--border-light)', letterSpacing: '0.5px'
                                        }}>
                                            {t.type === 'deposit' ? <Download size={14} /> : <Upload size={14} />} {t.type === 'deposit' ? 'Injection' : 'Extraction'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                        <div style={{ color: t.type === 'deposit' ? 'var(--success)' : 'var(--danger)', fontWeight: '950', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
                                            {t.type === 'deposit' ? '+' : '-'} $ {t.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                        <span style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                                            {t.paymentMode || 'SYSTEM'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <Clock size={14} color="var(--accent-primary)" /> {new Date(t.createdAt).toLocaleString()}
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

export default AllTransactions;
