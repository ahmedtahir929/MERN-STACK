import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ThemeProvider } from './ContextAPIs/ThemeContext.jsx';
import { Analytics } from '@vercel/analytics/react';

import App from './App.jsx';
import api from './utils/apiConfig';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Analytics />
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