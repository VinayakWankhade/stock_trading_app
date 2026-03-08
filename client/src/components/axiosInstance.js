import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://stock-trading-app-10g5.onrender.com/api',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
