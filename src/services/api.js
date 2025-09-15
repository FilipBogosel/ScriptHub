import axios from "axios";

// Add specific settings for cross-origin credentials
const axiosInstance = axios.create({
    baseURL: 'https://scripthub-server-c0a43f13db60.herokuapp.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosInstance;