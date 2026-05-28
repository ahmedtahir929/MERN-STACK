import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ThemeProvider } from './ContextAPIs/ThemeContext.jsx';

import App from './App.jsx';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Initialize the initial baseline authorization headers
// Initial Authorization Header Setup on App Load
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Global REQUEST Interceptor: Always attaches the latest token from localStorage
axios.interceptors.request.use(
  (config) => {
    const activeToken = localStorage.getItem('token');
    if (activeToken) {
      config.headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global RESPONSE Interceptor: Automatically catches and updates fresh refresh tokens
axios.interceptors.response.use(
  (response) => {
    // Look for the fresh token sent by the backend middleware
    const refreshToken = response.headers['x-refresh-token'];
    
    if (refreshToken) {
      // Silently overwrite the old token in localStorage with the new one
      localStorage.setItem('token', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;
    }
    return response;
  },
  (error) => {
    // Clear out session entirely if the token finally expires (1 hour of complete inactivity)
    if (error.response && error.response.status === 401) {
      const tokenExists = localStorage.getItem('token');
      
      if (tokenExists) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        
        toast.error("Your session has timed out due to inactivity. Please sign in again.");
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored" 
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);