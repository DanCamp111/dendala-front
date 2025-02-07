import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
});

// Add a request interceptor
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer' + token;
    }
    return config;
});
export default axiosInstance;

