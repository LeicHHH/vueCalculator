// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sportive.network/api', // your base URL
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      location.reload();
    }
    return Promise.reject(error);
  }
);

export default instance;