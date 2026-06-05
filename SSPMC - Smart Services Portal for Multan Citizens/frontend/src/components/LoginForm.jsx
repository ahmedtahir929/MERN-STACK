import React, { useState } from 'react';
import api from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import GoogleAuthButton from './GoogleAuthButton';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post(
        '/api/users/login',
        { email, password },
      );
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/home'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-500/10 text-red-500 text-sm p-3 rounded-md border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLocalLogin} className="space-y-4">
        <div>
          <label 
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--muted)' }}
          >
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
            placeholder="citizen@gmail.com"
          />
        </div>

        <div>
          <label 
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--muted)' }}
          >
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold p-3 rounded-md text-sm tracking-wide transition-colors mt-2 cursor-pointer"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div 
        className="flex items-center text-center my-5 text-sm before:flex-1 before:border-b before:mr-3 after:flex-1 after:border-b after:ml-3"
        style={{ color: 'var(--muted)', '--tw-border-opacity': '1', borderColor: 'var(--border)' }}
      >
        or
      </div>

      <GoogleAuthButton />
    </div>
  );
};

export default LoginForm;