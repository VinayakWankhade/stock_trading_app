import React, { useEffect, useState } from 'react';
import { useGeneral } from '../context/GeneralContext';
import axios from '../components/axiosInstance';
import { Wallet, Plus, ArrowUpRight, History, X, TrendingUp, TrendingDown, User2, Mail, Shield, RefreshCw } from 'lucide-react';

// ─── Modal Component ──────────────────────────────────────────────
const FundModal = ({ type, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('IMPS');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!amount || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        setLoading(true);
        try {
            const endpoint = type === 'deposit' ? '/user/funds/add' : '/user/funds/withdraw';
            const res = await axios.post(endpoint, { amount: Number(amount), paymentMode });
            onSuccess(res.data.data.balance);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const isDeposit = type === 'deposit';

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(30, 41, 59, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2.5rem',
                width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)',
                border: '1px solid var(--border-light)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '12px',
                            background: 'var(--bg-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border-light)'
                        }}>
                            {isDeposit ? <Plus size={20} color="var(--accent-primary)" /> : <ArrowUpRight size={20} color="var(--accent-primary)" />}
                        </div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                            {isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}>
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Amount (INR)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1"
                            style={{
                                width: '100%', padding: '1rem', borderRadius: '12px',
                                border: '1.5px solid var(--border-light)', fontSize: '1.25rem', fontWeight: '800',
                                outline: 'none', boxSizing: 'border-box', background: 'var(--bg-primary)',
                                color: 'var(--text-primary)', transition: 'all 0.2s',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = 'var(--accent-primary)';
                                e.target.style.background = 'var(--bg-secondary)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = 'var(--border-light)';
                                e.target.style.background = 'var(--bg-primary)';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Preferred Channel
                        </label>
                        <select
                            value={paymentMode}
                            onChange={e => setPaymentMode(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem', borderRadius: '12px',
                                border: '1.5px solid var(--border-light)', fontSize: '1rem', fontWeight: '600',
                                outline: 'none', background: 'var(--bg-primary)', cursor: 'pointer', boxSizing: 'border-box',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <option value="IMPS">Direct IMPS</option>
                            <option value="NEFT">Bank NEFT</option>
                            <option value="UPI">Instant UPI</option>
                            <option value="Net Banking">Net Banking Portal</option>
                        </select>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: '500' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 2, padding: '1rem', borderRadius: '12px', border: 'none',
                                background: isDeposit ? 'var(--accent-primary)' : 'var(--danger)',
                                color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '1rem',
                                letterSpacing: '0.5px', textTransform: 'uppercase',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Processing...' : (isDeposit ? 'Confirm Deposit' : 'Confirm Withdrawal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Profile Component ───────────────────────────────────────
const Profile = () => {
    const { user, setUser } = useGeneral();
    const [transactions, setTransactions] = useState([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [modal, setModal] = useState(null); // null | 'deposit' | 'withdrawal'

    const fetchFundHistory = async () => {
        try {
            setLoadingTx(true);
            const res = await axios.get('/user/funds/history');
            setTransactions(res.data.data || []);
        } catch (err) {
            console.error('Error fetching fund history:', err);
        } finally {
            setLoadingTx(false);
        }
    };

    useEffect(() => {
        fetchFundHistory();
    }, []);

    const handleFundSuccess = (newBalance) => {
        setUser(prev => ({ ...prev, balance: newBalance }));
        fetchFundHistory();
    };

    if (!user) return null;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const totalDeposited = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
    const totalWithdrawn = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }} className="animate-fade-in">

            {/* ── Page Header ── */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '2rem' }}>
                Account Overview
            </h1>

            {/* ── Greeting & Balance Card (Mockup Style) ── */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '24px',
                padding: '2.5rem',
                marginBottom: '3rem',
                border: '1px solid var(--border-light)'
            }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'capitalize' }}>Welcome back, {user.name || 'Trader'}</p>

                <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '12px',
                    padding: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--border-light)'
                }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Available Liquidity</p>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-1px' }}>
                            $ {(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setModal('deposit')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                border: '1.5px solid var(--accent-primary)', color: 'white', background: 'var(--accent-primary)', padding: '0.85rem 1.75rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
                            }}
                        >
                            <Plus size={18} /> Deposit
                        </button>
                        <button
                            onClick={() => setModal('withdrawal')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                border: '1.5px solid var(--border-light)', color: 'var(--accent-primary)', background: 'white', padding: '0.85rem 1.75rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
                            }}
                        >
                            <ArrowUpRight size={18} /> Withdraw
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Transactions Section (Mockup Style) ── */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        Execution Logs
                    </h2>
                    <button onClick={fetchFundHistory} style={{ background: 'none', border: '1px solid var(--border-light)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loadingTx ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border-light)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>No transactions found</p>
                        </div>
                    ) : (
                        transactions.map((t, i) => (
                            <div
                                key={t._id || i}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                    padding: '1.5rem 2rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '20px',
                                    alignItems: 'center',
                                    border: '1px solid var(--border-light)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Capital Flow</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹ {t.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Type</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: t.type === 'deposit' ? 'var(--success)' : 'var(--danger)' }}>
                                        {t.type === 'deposit' ? 'INFLOW' : 'OUTFLOW'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Channel</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.paymentMode}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Timestamp</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {new Date(t.createdAt).toLocaleDateString()} • {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* ── Modals ── */}
            {modal && (
                <FundModal
                    type={modal}
                    onClose={() => setModal(null)}
                    onSuccess={handleFundSuccess}
                />
            )}
        </div>
    );
};

export default Profile;
