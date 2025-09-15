import axios from "axios";

// Add specific settings for cross-origin credentials
const axiosInstance = axios.create({
    baseURL: 'https://scripthub-server-c0a43f13db60.herokuapp.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a specific debug interceptor for cookies
axiosInstance.interceptors.request.use(request => {
    console.log('Request URL:', request.url);
    console.log('Request with credentials:', request.withCredentials);
    console.log('Request cookies being sent:', document.cookie);
    return request;
});

// Add response interceptor to see what cookies are being set
axiosInstance.interceptors.response.use(response => {
    console.log('Response cookies:', response.headers['set-cookie']);
    return response;
});

export default axiosInstance;