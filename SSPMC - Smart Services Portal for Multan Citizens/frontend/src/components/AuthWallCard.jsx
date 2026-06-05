import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const AuthWallCard = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300">
      <div 
        className="max-w-md w-full p-6 rounded-2xl shadow-xl text-center relative animate-scale-up transition-colors duration-300"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--text)'
        }}
      >
        
        {/* Close Cross */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors cursor-pointer text-xl opacity-60 hover:opacity-100"
          style={{ color: 'var(--text)' }}
        >
          &times;
        </button>

        {/* Locked Shield Circle */}
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
          <FaLock />
        </div>

        <h3 className="text-xl font-bold tracking-tight">Authentication Required</h3>
        <p 
          className="text-sm mt-2 px-2 opacity-80"
          style={{ color: 'var(--muted)' }}
        >
          To help keep public information safe and prevent local data vandalism, you must register a citizen account or sign in to contribute services.
        </p>

        {/* Action Gate Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-3 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="flex-1 font-semibold p-3 rounded-lg text-sm transition-colors cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthWallCard;