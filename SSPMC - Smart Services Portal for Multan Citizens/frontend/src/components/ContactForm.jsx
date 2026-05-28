import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ContactForm = ({ onSend }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general',
  });

  // Track if a validation fault occurred to trigger dynamic style shifting
  const [isValidationError, setIsValidationError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Field parameter checks
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setIsValidationError(true); // Flip warning flag to true to change text color to red
      toast.warning('Please completely fill in all required text boxes.');
      return;
    }

    // Reset error warning if checks pass on a subsequent click
    setIsValidationError(false);

    // Proxy data payload execution bubble upward
    onSend(form, () => {
      // Success Callback: Reset input state blocks cleanly upon endpoint resolution
      setForm({ name: '', email: '', message: '', type: 'general' });
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-sm"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
      
      {/* Dynamic conditional styling shifts between standard muted variable and alert red text */}
      <p 
        className={`mb-3 text-xs font-semibold transition-colors duration-300 ${
          isValidationError ? 'text-red-500 animate-pulse' : 'opacity-60'
        }`}
        style={!isValidationError ? { color: 'var(--muted)' } : {}}
      >
        *All fields are mandatory configuration parameters
      </p>

      {/* NAME */}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-3 rounded-lg focus:outline-none text-sm"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        required
      />

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-3 rounded-lg focus:outline-none text-sm"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        required
      />

      {/* TYPE CLASSIFICATION DROPDOWN */}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-3 rounded-lg focus:outline-none text-sm font-medium"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        <option value="general">General Inquiry</option>
        <option value="suggestion">Suggestion</option>
        <option value="complaint">Complaint / Grievance Desk</option>
      </select>

      {/* MESSAGE TEXTAREA */}
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        rows="5"
        className="w-full mb-4 px-4 py-3 rounded-lg focus:outline-none text-sm"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        required
      />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition text-white font-semibold text-sm cursor-pointer shadow-md shadow-emerald-500/10"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default ContactForm;