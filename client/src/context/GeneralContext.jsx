import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const GeneralContext = createContext();

export const useGeneral = () => useContext(GeneralContext);

export const GeneralProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set default axios base URL
    axios.defaults.baseURL = 'http://localhost:8000/api';

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const res = await axios.get('/user/me');
            setUser(res.data.data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            setError(err.response?.data?.error || 'Session expired');
        }
    };

    const login = async (formData) => {
        setLoading(true);
        try {
            const res = await axios.post('/user/login', formData);
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setError(null);

            // Immediately load user profile to sync state
            await loadUser();

            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            setLoading(false);
            return { success: false, error: err.response?.data?.error };
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const res = await axios.post('/user/register', formData);
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setError(null);
            // Immediately load user so isAuthenticated + user are set → triggers redirect
            await loadUser();
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            setLoading(false);
            return { success: false, error: err.response?.data?.error };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    const clearError = () => setError(null);

    return (
        <GeneralContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                login,
                register,
                logout,
                clearError,
                setUser,
                loadUser
            }}
        >
            {children}
        </GeneralContext.Provider>
    );
};

export default GeneralContext;
