import axios from 'axios';

const api = axios.create({
  baseURL: 'https://69c3da54b780a9ba03e821cf.mockapi.io'
});

export default api;