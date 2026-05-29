import axios from 'axios';

const API = axios.create({
    baseURL: 'https://smartbook-marketplace.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically inject our JWT token into the headers of every single request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;