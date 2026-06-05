import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center pt-24 pb-16 px-4 font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <div 
        className="max-w-md w-full p-8 rounded-xl shadow-md my-auto transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--card)', 
          border: '1px solid var(--border)' 
        }}
      >
        <div 
          className="text-center mb-6 border-b pb-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-xl font-bold tracking-tight">Smart Services & Public Management Console</h2>
          <p 
            className="text-xs font-semibold uppercase tracking-wider mt-1" 
            style={{ color: 'var(--muted)' }}
          >
            Multan District Administration
          </p>
        </div>
        <h3 className="text-lg font-semibold mb-4">Citizen Sign In</h3>
        
        <LoginForm />

        <div 
          className="text-center mt-6 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          Are you a new resident? <Link to="/signup" className="text-emerald-500 font-semibold hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;