import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { loading, error, isAuthenticated, user, login, clearError } = useGeneral();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        }
        return () => clearError();
    }, [isAuthenticated, user, navigate, clearError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        // Navigation is handled by the useEffect once isAuthenticated and user are set
    };

    return (
        <div className="flex-center min-vh-100" style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc' }}>
            <div className="pro-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3.5rem 3rem' }}>
                <div className="flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
                    <div className="flex-center" style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '1rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        marginBottom: '1rem'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.25rem', color: '#1e3a8a', fontFamily: 'Outfit, sans-serif' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Log in to access your portfolio</p>
                </div>

                {error && (
                    <div className="flex-center" style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        color: 'var(--danger)',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} />
                        <p style={{ fontSize: '0.9rem' }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
