import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/v2',
  headers: {
    'trades-trek-version': '2.0',
    dm: 'tt_web_app',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;