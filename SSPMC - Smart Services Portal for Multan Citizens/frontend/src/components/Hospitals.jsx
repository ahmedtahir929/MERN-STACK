import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar, FaEdit } from 'react-icons/fa';
import EmptyServicesState from './EmptyServicesState';

const Hospitals = ({ items, onEdit }) => {
  const location = useLocation();

  // Extract the ?highlight=ID query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get('highlight');

  useEffect(() => {
    if (highlightId && items.length > 0) {
      // Small timeout to guarantee DOM rendering cycles are complete
      const timer = setTimeout(() => {
        const element = document.getElementById(`service-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightId, items]);

  if (!items || items.length === 0) {
    return <EmptyServicesState categoryName="Hospitals" />;
  }

  return (
    <div className="w-full space-y-4">
      {items.map((item) => {
        const cardImageSrc = item.imageUpload
          ? `http://localhost:4000${item.imageUpload}`
          : item.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image';

        const locationText = item.location?.address || item.loc || 'Address not registered';
        const isHighlighted = item._id === highlightId;

        return (
          <div
            id={`service-${item._id}`} // Unique DOM target id mapping anchor
            key={item._id}
            className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-5 rounded-xl border group transition-all relative ${
              isHighlighted ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10' : ''
            }`}
            style={{
              borderColor: isHighlighted ? '#10b981' : 'var(--border)',
              backgroundColor: 'var(--card)',
            }}
          >
            {/* IMAGE SECTION */}
            <div className="w-full md:w-32 h-48 md:h-32 rounded-lg bg-gray-800 shrink-0 overflow-hidden">
              <img src={cardImageSrc} alt={item.name} className="w-full h-full object-cover" />
            </div>

            {/* CONTENT SECTION */}
            <div className="grow w-full">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h4 className="text-xl font-bold text-emerald-500 wrap-break-words">
                    {item.name}
                  </h4>
                  <span className="flex items-center self-start gap-1 text-sm bg-emerald-500/10 px-2 py-1 rounded text-emerald-500 whitespace-nowrap">
                    <FaStar size={12} /> {item.rating || 'N/A'}
                  </span>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="flex items-center gap-1 md:hidden shrink-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-full hover:bg-emerald-500/10 text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
              </div>

              <p className="text-md mt-1 wrap-break-words opacity-80" style={{ color: 'var(--text)' }}>
                {locationText}
              </p>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="p-3 rounded-full hover:bg-emerald-500/10 text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Edit Service"
              >
                <FaEdit size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Hospitals;