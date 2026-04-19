import axios from "axios";

const api = axios.create({
    baseURL: 'https://khanh2k5pc-cinema-api-springboot.hf.space/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default api;