import React, { useState } from 'react';
import api from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import GoogleAuthButton from './GoogleAuthButton';

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocalSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/api/users/signup',
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        },
      );

      if (response.status === 201) {
        alert('Registration complete! Redirecting to login window.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failure.');
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

      <form onSubmit={handleLocalSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--muted)' }}
            >
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              required
              value={formData.firstname}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)'
              }}
              placeholder="Zohaib"
            />
          </div>
          <div>
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--muted)' }}
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              required
              value={formData.lastname}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)'
              }}
              placeholder="Hassan"
            />
          </div>
        </div>

        <div>
          <label 
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--muted)' }}
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
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
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label 
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--muted)' }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
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
          {loading ? 'Creating Account...' : 'Register'}
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

export default SignupForm;