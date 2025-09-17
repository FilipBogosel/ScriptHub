import axios from "axios";

// Add specific settings for cross-origin credentials
const axiosInstance = axios.create({
    baseURL: 'https://scripthub-server-c0a43f13db60.herokuapp.com',
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;