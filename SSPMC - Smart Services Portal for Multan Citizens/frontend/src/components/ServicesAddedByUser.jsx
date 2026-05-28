import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiSearch } from 'react-icons/fi';

const ServicesAddedByUser = ({ myServices, onRemove }) => {
  const [query, setQuery] = useState('');

  const filteredServices = (myServices || []).filter(
    (item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="p-5 rounded-xl shadow-sm flex flex-col animate-fade-in"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* SEARCH INPUT BAR */}
      <div className="mb-4 relative">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Search Services Added by You..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-transparent text-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* RENDER LOGIC */}
      {!myServices || myServices.length === 0 ? (
        <div
          className="w-full flex items-center justify-center border border-dashed rounded-lg"
          style={{ minHeight: '312px', borderColor: 'var(--border)' }}
        >
          <p
            className="text-xs py-4 text-center opacity-60 italic"
            style={{ color: 'var(--muted)' }}
          >
            You haven't contributed any entries yet.
          </p>
        </div>
      ) : (
        <div
          className="space-y-3 max-h-78 overflow-y-auto overflow-x-hidden pr-1.5 custom-scrollbar flex flex-col"
          style={{ minHeight: '312px' }}
        >
          {filteredServices.length === 0 ? (
            <div
              className="w-full flex-1 flex items-center justify-center border border-dashed rounded-lg"
              style={{ borderColor: 'var(--border)' }}
            >
              <p
                className="text-xs py-6 text-center opacity-60 italic"
                style={{ color: 'var(--muted)' }}
              >
                No services match your search terms.
              </p>
            </div>
          ) : (
            filteredServices.map((item) => {
              const pluralCategory = item.category?.toLowerCase() + 's';

              /* FIXED: Appends the item ID as a query string parameter 
                 Example output: /services/hospitals?highlight=60b7f5ec...
              */
              const deepLinkedPath = `/services/${pluralCategory}?highlight=${item._id}`;

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-lg flex items-center justify-between gap-4 animate-in fade-in duration-200 shrink-0"
                  style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={deepLinkedPath}
                      className="font-bold text-sm hover:text-emerald-500 transition-colors block truncate pr-2 cursor-pointer"
                      title={`Maps and find ${item.name}`}
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-500 block mt-0.5">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemove(item._id, item.name)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                    title="Remove Listing"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesAddedByUser;
