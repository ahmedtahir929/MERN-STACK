import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';

const UpdateUserProfileForm = ({ initialData, onSave }) => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });

  // Watch individual string values to trigger immediate form field synchronization on Axios resolution
  useEffect(() => {
    if (initialData) {
      setForm({
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        email: initialData.email || '',
      });
    }
  }, [initialData.firstname, initialData.lastname, initialData.email]); // Monitored primitive properties explicitly

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-sm space-y-4"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <FiUser className="text-emerald-500" /> Personal Identity
      </h3>
      <hr style={{ borderColor: 'var(--border)' }} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="text-xs font-semibold block mb-2"
            style={{ color: 'var(--muted)' }}
          >
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg focus:outline-none text-sm"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            required
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold block mb-2"
            style={{ color: 'var(--muted)' }}
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg focus:outline-none text-sm"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            required
          />
        </div>
      </div>

      <div>
        <label
          className="text-xs font-semibold block mb-2"
          style={{ color: 'var(--muted)' }}
        >
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-3 rounded-lg focus:outline-none text-sm"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition text-white font-medium text-sm ml-auto"
      >
        <FiSave /> Save Details
      </button>
    </form>
  );
};

export default UpdateUserProfileForm;
