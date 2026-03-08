import React, { useEffect, useState } from 'react';
import axios from '../components/axiosInstance';
import { Search, User, Mail, CreditCard, ChevronRight, ShieldAlert, Activity, DollarSign } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/admin/users');
                setUsers(res.data.data);
                setFilteredUsers(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u._id.includes(searchTerm)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Entity Directory</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Internal registry of all registered platform participants.</p>
                </div>

                <div style={{ position: 'relative', width: '350px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Filter by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '16px',
                            border: '1.5px solid var(--border-light)',
                            background: 'var(--bg-secondary)',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                    />
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
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entity Details</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Access Keys</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Liquid Capital</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Establishing connection to user database...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>No users found matching your search criteria.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '42px', height: '42px', borderRadius: '12px',
                                                background: 'var(--bg-primary)', color: 'var(--accent-primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: '800', fontSize: '1.1rem', border: '1px solid var(--border-light)'
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{user.name}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={14} color="var(--accent-primary)" /> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{user._id}</span></div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={14} color="var(--success)" /> <span style={{ color: 'var(--success)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem' }}>Authorized Session</span></div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            background: 'var(--bg-primary)', color: 'var(--accent-primary)',
                                            padding: '8px 16px', borderRadius: '10px', fontWeight: '900',
                                            fontSize: '1.1rem', border: '1px solid var(--border-light)'
                                        }}>
                                            <DollarSign size={16} />
                                            {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <button style={{
                                            background: 'var(--bg-primary)', border: '1.5px solid var(--border-light)',
                                            padding: '8px 16px', borderRadius: '10px', color: 'var(--accent-primary)',
                                            fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer',
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            transition: 'all 0.2s', textTransform: 'uppercase'
                                        }} onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>
                                            Control <ChevronRight size={14} />
                                        </button>
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

export default Users;
