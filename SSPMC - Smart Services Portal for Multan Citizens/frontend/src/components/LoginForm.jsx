import React, { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post(
        'http://localhost:4000/api/users/login',
        { email, password },
      );
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.token}`;
        
        // Fixed path targeting your application routes architecture layout
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
        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLocalLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
            placeholder="citizen@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
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

      <div className="flex items-center text-center my-5 text-gray-400 text-sm before:flex-1 before:border-b before:border-gray-200 before:mr-3 after:flex-1 after:border-b after:border-gray-200 after:ml-3">
        or
      </div>

      <GoogleAuthButton />
    </div>
  );
};

export default LoginForm;