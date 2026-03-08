import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, ShieldAlert, CreditCard, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../components/axiosInstance';

const Admin = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalVolume: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [u, o] = await Promise.all([
                    axios.get('/admin/users'),
                    axios.get('/admin/orders')
                ]);
                const users = u.data.data;
                const orders = o.data.data;
                const volume = orders.reduce((acc, curr) => acc + curr.totalCost, 0);

                setStats({
                    totalUsers: users.length,
                    totalOrders: orders.length,
                    totalVolume: volume
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>System Control</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Centralized oversight of platform liquidity and user activity.</p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="pro-card" style={{ background: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Users</span>
                        <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-light)' }}><Users size={20} color="var(--accent-primary)" /></div>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', margin: 0, letterSpacing: '-1px' }}>{stats.totalUsers}</h2>
                </div>
                <div className="pro-card" style={{ background: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Capital Volume</span>
                        <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-light)' }}><DollarSign size={20} color="var(--accent-primary)" /></div>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', margin: 0, letterSpacing: '-1px' }}>$ {stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                </div>
                <div className="pro-card" style={{ background: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Executions</span>
                        <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-light)' }}><Activity size={20} color="var(--accent-primary)" /></div>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', margin: 0, letterSpacing: '-1px' }}>{stats.totalOrders}</h2>
                </div>
            </div>

            {/* Quick Navigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'left' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>
                        <div style={{ background: 'var(--bg-primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
                            <Users size={32} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', fontWeight: '800', marginBottom: '0.75rem' }}>Entity Registry</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Full control over user permissions, liquidity levels, and account integrity.</p>
                        <span style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>OPEN REGISTRY →</span>
                    </div>
                </Link>

                <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'left' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>
                        <div style={{ background: 'var(--bg-primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
                            <ShoppingBag size={32} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', fontWeight: '800', marginBottom: '0.75rem' }}>Global Order Stream</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Audit every active position and historical execution across the entire platform.</p>
                        <span style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>VIEW STREAM →</span>
                    </div>
                </Link>

                <Link to="/admin/funds" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'left' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>
                        <div style={{ background: 'var(--bg-primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
                            <BarChart3 size={32} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', fontWeight: '800', marginBottom: '0.75rem' }}>Capital Audit</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Monitor capital flows, deposit approvals, and system-wide financial integrity.</p>
                        <span style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>REVIEW CAPITAL →</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Admin;
