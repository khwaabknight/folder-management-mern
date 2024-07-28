import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
  withCredentials: true,
});

//Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log('Request error', error);
    Promise.reject(error)
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (assuming API returns a specific status code)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/refresh-token`, {}, { withCredentials: true });

        // If the token is successfully refreshed, retry the original request
        if (response.status === 200) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refreshing the token fails, redirect to login or handle the error
        console.log('Refresh token failed', refreshError)
        const navigate = useNavigate();
        navigate('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;