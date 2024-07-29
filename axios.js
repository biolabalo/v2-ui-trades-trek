import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api-rebuild.tradestrek.com/v2',
  headers: {
    'trades-trek-version': '2.0',
    dm: 'tt_web_app',
  },
});

export default axiosInstance;