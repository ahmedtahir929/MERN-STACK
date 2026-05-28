import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInbox, FaPlus } from 'react-icons/fa';

const EmptyServicesState = ({ categoryName }) => {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('token');

  return (
    <div
      className="w-full text-center py-16 px-4 rounded-2xl border border-dashed flex flex-col items-center justify-center animate-fade-in"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      {/* Icon Box */}
      <div className="w-16 h-16 bg-black-100 dark:bg-white-800 rounded-full flex items-center justify-center text-emerald-500 text-2xl mb-4 shadow-sm">
        <FaInbox />
      </div>

      {/* Message Text */}
      <h4
        className="text-lg font-bold opacity-90"
        style={{ color: 'var(--text)' }}
      >
        No {categoryName} Listed Yet
      </h4>
      <p
        className="text-sm max-w-sm mt-1 mb-6 opacity-70"
        style={{ color: 'var(--muted)' }}
      >
        There are currently no registered records for this directory. Help
        update the community console by adding verified local details.
      </p>

      {/* Call to Actions based on Authentication status */}
      {hasToken ? (
        <p className="text-sm font-semibold text-emerald-500 flex flex-wrap items-center gap-2 text-center sm:text-left justify-center sm:justify-start">
          <span>Use the</span>

          <span className="bg-emerald-500 text-white px-2 py-2 rounded text-xs inline-flex items-center gap-1 whitespace-nowrap">
            <FaPlus size={10} /> Add New Service
          </span>

          <span>button above to contribute!</span>
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <p className="text-sm opacity-80" style={{ color: 'var(--text)' }}>
            Want to contribute?
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Create an Account
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyServicesState;
