import React, { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post(
        'http://localhost:4000/api/users/signup',
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
        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLocalSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              required
              value={formData.firstname}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
              placeholder="Zohaib"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              required
              value={formData.lastname}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
              placeholder="Hassan"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
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
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 transition-all"
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

      <div className="flex items-center text-center my-5 text-gray-400 text-sm before:flex-1 before:border-b before:border-gray-200 before:mr-3 after:flex-1 after:border-b after:border-gray-200 after:ml-3">
        or
      </div>

      <GoogleAuthButton />
    </div>
  );
};

export default SignupForm;
