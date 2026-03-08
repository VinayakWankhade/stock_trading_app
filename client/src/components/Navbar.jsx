import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { useSocket } from '../context/SocketContext';
import { Home, Briefcase, History, User, LogOut, LayoutDashboard, Globe, Shield, TrendingUp } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useGeneral();
    const { isConnected } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdminRoute = location.pathname.startsWith('/admin');

    if (user?.role === 'admin' && isAdminRoute) {
        return (
            <nav style={{
                background: 'var(--bg-secondary)',
                padding: '0.75rem 2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid var(--border-light)',
                backdropFilter: 'blur(10px)'
            }}>
                <Link to="/admin" className="flex-center" style={{ textDecoration: 'none' }}>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--accent-primary)',
                        fontFamily: 'Outfit, sans-serif'
                    }}>QuantEdge <span style={{ fontWeight: '400', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>(ADMIN)</span></span>
                </Link>

                <div className="flex-center" style={{ gap: '2rem' }}>
                    <Link to="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Dashboard</Link>
                    <Link to="/admin/users" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Users</Link>
                    <Link to="/admin/orders" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Orders</Link>
                    <Link to="/admin/funds" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Capital Flow</Link>
                    <button onClick={handleLogout} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        padding: 0
                    }}>
                        LOGOUT
                    </button>
                </div>
            </nav>
        );
    }

    return (
        <nav style={{
            background: 'var(--bg-secondary)',
            padding: '1rem 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--border-light)',
            backdropFilter: 'blur(10px)'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: 'var(--accent-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    letterSpacing: '-0.5px'
                }}>QuantEdge</span>
            </Link>

            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dashboard</Link>
                        <Link to="/portfolio" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portfolio</Link>
                        <Link to="/history" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>History</Link>
                        <Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile</Link>
                        <button onClick={handleLogout} style={{
                            background: 'none', border: 'none', color: 'var(--danger)',
                            cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontWeight: '700', textTransform: 'uppercase'
                        }}>LOGOUT</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>LOGIN</Link>
                        <Link to="/register" style={{ background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '800', padding: '8px 24px', borderRadius: '10px' }}>GET STARTED</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
