import axios from 'axios';

axios.interceptors.request.use((request) => {
  const token = sessionStorage.getItem('token');
  debugger;

  if (token != null) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
}, (error) => {
  return Promise.reject(error);
});
