import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api', // Ensure this matches your backend
  withCredentials: true
});

export default api;