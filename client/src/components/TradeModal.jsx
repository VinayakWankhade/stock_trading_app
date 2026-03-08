import React, { useState } from 'react';
import api from '../services/api';
import { X, ShoppingCart, Tag, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const TradeModal = ({ isOpen, onClose, stock, onTradeSuccess }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState('');

    if (!isOpen || !stock) return null;

    const totalCost = (stock.quote.price * quantity).toFixed(2);

    const handleTrade = async (type) => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await api.post(`/transaction/${type.toLowerCase()}`, {
                ticker: stock.ticker,
                quantity: parseInt(quantity)
            });

            setStatus('success');
            setMessage(`Successfully ${type === 'BUY' ? 'purchased' : 'sold'} ${quantity} shares of ${stock.ticker}`);
            setTimeout(() => {
                onTradeSuccess();
                onClose();
                setStatus(null);
                setQuantity(1);
            }, 2000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Trade failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="pro-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '2.5rem',
                position: 'relative',
                backgroundColor: 'white'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                }}>
                    <X size={24} />
                </button>

                <h3 style={{ fontSize: '1.75rem', color: '#1e3a8a', fontFamily: 'Outfit, sans-serif', marginBottom: '1.5rem' }}>Execute Trade</h3>

                <div style={{
                    background: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-light)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Stock</span>
                        <span style={{ fontWeight: '600' }}>{stock.profile.name} ({stock.ticker})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Current Price</span>
                        <span style={{ fontWeight: '600' }}>${stock.quote.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Value</span>
                        <span className="text-gradient" style={{ fontWeight: '800', fontSize: '1.2rem' }}>${totalCost}</span>
                    </div>
                </div>

                {status === 'success' && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '0.75rem', color: 'var(--success)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <CheckCircle size={20} />
                        <p style={{ fontSize: '0.9rem' }}>{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '0.75rem', color: 'var(--danger)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <AlertTriangle size={20} />
                        <p style={{ fontSize: '0.9rem' }}>{message}</p>
                    </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.750rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'white',
                            border: '1px solid var(--border-light)',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            outline: 'none',
                            textAlign: 'center'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                        onClick={() => handleTrade('BUY')}
                        disabled={loading || status === 'success'}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShoppingCart size={18} /> Buy</>}
                    </button>
                    <button
                        onClick={() => handleTrade('SELL')}
                        disabled={loading || status === 'success'}
                        className="btn"
                        style={{ background: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Tag size={18} /> Sell
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
