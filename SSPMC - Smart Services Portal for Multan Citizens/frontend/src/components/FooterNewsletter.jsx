import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning('Please input a valid email address.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        'http://localhost:4000/api/newsletter/subscribe',
        {
          email: email.trim(),
        },
      );

      toast.success(response.data.message || 'Subscribed successfully!');
      setEmail(''); // Completely flush input string upon success parameters resolution
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to submit newsletter registration details.',
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4" style={{ color: 'var(--navtext)' }}>
        Subscribe to Our Newsletter
      </h3>
      <p
        className="text-sm mb-3 opacity-80"
        style={{ color: 'var(--navtext)' }}
      >
        Get the latest updates and news.
      </p>

      <form onSubmit={handleSubscribe} className="flex w-full items-stretch">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className="w-full px-3 py-2 rounded-l-md text-sm focus:outline-none disabled:opacity-50"
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRight: 'none',
          }}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 px-4 py-2 rounded-r-md text-white hover:bg-emerald-700 transition flex items-center justify-center cursor-pointer min-w-13.75 text-sm font-semibold disabled:opacity-50 select-none"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Go'
          )}
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
