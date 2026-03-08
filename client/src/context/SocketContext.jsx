import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useGeneral } from './GeneralContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [prices, setPrices] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated } = useGeneral();

    useEffect(() => {
        if (!isAuthenticated) return;

        const newSocket = io('http://localhost:8000', {
            transports: ['polling', 'websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('priceUpdate', (updatedPrices) => {
            setPrices(updatedPrices);
        });

        newSocket.on('connect_error', (err) => {
            console.warn('[Socket] Connection error:', err.message);
            setIsConnected(false);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, prices, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
