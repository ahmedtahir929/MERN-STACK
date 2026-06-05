import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './ContextAPIs/ThemeContext.jsx';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Analytics />
        <ToastContainer theme="colored" />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);