import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, Globe } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-vh-100 flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
            <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
                <div className="flex-center" style={{ marginBottom: '3.5rem' }}>
                    <div className="pro-card flex-center" style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '24px',
                        background: 'var(--bg-secondary)',
                        border: '2px solid var(--accent-primary)',
                        boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.15)'
                    }}>
                        <TrendingUp size={48} color="var(--accent-primary)" />
                    </div>
                </div>

                <h1 style={{ fontSize: '4.5rem', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', fontWeight: '900', lineHeight: '1', marginBottom: '2.5rem', letterSpacing: '-2px' }}>
                    PRECISION TRADING <br /><span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>WITHOUT EXPOSURE</span>
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Join QuantEdge, the premium virtual trading simulator. Practice your strategies with real-time data,
                    compete with others, and build your portfolio without financial risk.
                </p>

                <div className="flex-center" style={{ gap: '2rem' }}>
                    <Link to="/register" className="btn" style={{
                        padding: '1.25rem 3rem', fontSize: '1rem', background: 'var(--accent-primary)', color: 'white',
                        fontWeight: '800', borderRadius: '14px', textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                        Initialize Terminal
                    </Link>
                    <Link to="/login" className="btn" style={{
                        padding: '1.25rem 3rem',
                        fontSize: '1rem',
                        background: 'var(--bg-secondary)',
                        color: 'var(--accent-primary)',
                        fontWeight: '800',
                        borderRadius: '14px',
                        border: '2px solid var(--accent-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Access Vault
                    </Link>
                </div>
            </div>

            <div className="flex-center" style={{ marginTop: '5rem', gap: '3rem', flexWrap: 'wrap' }}>
                {[
                    { icon: Globe, title: 'QUANTITATIVE DATA', desc: 'Enterprise-grade feeds from global liquidity centers' },
                    { icon: Shield, title: 'EQUITY ISOLATION', desc: 'Simulated environment for structural capital safety' },
                    { icon: BarChart3, title: 'ANALYTIC PRECISION', desc: 'Institutional charting tools for market intelligence' }
                ].map((feature, i) => (
                    <div key={i} className="pro-card animate-slide-up" style={{
                        padding: '3rem 2rem',
                        width: '320px',
                        animationDelay: `${i * 0.1}s`,
                        background: 'var(--bg-secondary)',
                        borderRadius: '24px',
                        border: '1px solid var(--border-light)',
                        textAlign: 'center'
                    }}>
                        <div style={{ background: 'var(--bg-primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--border-light)' }}>
                            <feature.icon style={{ color: 'var(--accent-primary)' }} size={32} />
                        </div>
                        <h3 style={{ color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', fontWeight: '900', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.5px' }}>{feature.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '600' }}>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
