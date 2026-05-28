import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from 'axios'; 
import {
  FaHospital,
  FaUtensils,
  FaTree,
  FaPlus,
  FaSearch,
  FaExclamationCircle,
} from 'react-icons/fa';

import AddService from '../components/AddService';
import Hospitals from '../components/Hospitals';
import Restaurants from '../components/Restaurants';
import Parks from '../components/Parks';
import AuthWallCard from '../components/AuthWallCard';
import ServiceUpdatePanel from '../components/ServiceUpdatePanel';

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listingsRef = useRef(null); 
  const [showForm, setShowForm] = useState(false);
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [editingService, setEditingService] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [data, setData] = useState({
    hospitals: [],
    restaurants: [],
    parks: [],
  });

  const mainCategories = [
    {
      id: 'hospitals',
      name: 'Hospitals',
      desc: 'Find nearby healthcare quickly.',
      icon: <FaHospital />,
      bgImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishtar_Hospital_Multan_Close_View.jpg',
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      desc: 'Discover best food spots.',
      icon: <FaUtensils />,
      bgImg: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/4d/11/94/exterior-facade.jpg?w=900&h=500&s=1',
    },
    {
      id: 'parks',
      name: 'Parks',
      desc: 'Explore outdoor spaces.',
      icon: <FaTree />,
      bgImg: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Yaadgaar-E-Shauhda_Multan_Cantt.jpg',
    },
  ];

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosInstance.get('http://localhost:4000/api/services');

        const fetchedItems = response.data;
        setData({
          hospitals: fetchedItems.filter((item) => item.category === 'hospital'),
          restaurants: fetchedItems.filter((item) => item.category === 'restaurant'),
          parks: fetchedItems.filter((item) => item.category === 'park'),
        });
      } catch (err) {
        setError('Failed to fetch platform service records from the district nodes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllServices();
  }, [location.pathname]);

  const handleAddServiceClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthWall(true);
    } else {
      setShowForm(true);
    }
  };

  const handleAddService = async (newServiceData) => {
    const stateKey = newServiceData.category.toLowerCase() + 's';

    setData((prevData) => ({
      ...prevData,
      [stateKey]: [newServiceData, ...prevData[stateKey]], 
    }));

    setSearchTerm(''); 
    navigate(`/services/${stateKey}`);
    setShowForm(false);
    
    setTimeout(() => {
      listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEditServiceClick = (serviceItem) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthWall(true);
    } else {
      setEditingService(serviceItem); 
    }
  };

  const handleUpdateSuccess = (updatedService) => {
    const stateKey = updatedService.category.toLowerCase() + 's';

    setData((prevData) => ({
      ...prevData,
      [stateKey]: prevData[stateKey].map((item) =>
        item._id === updatedService._id ? updatedService : item
      ),
    }));
  };

  const isSelected =
    location.pathname.includes('/services/hospitals') ||
    location.pathname.includes('/services/restaurants') ||
    location.pathname.includes('/services/parks');

  const filteredHospitals = data.hospitals.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRestaurants = data.restaurants.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredParks = data.parks.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderNoMatchesMessage = () => (
    <div 
      className="w-full text-center py-12 px-4 rounded-xl border border-dashed flex flex-col items-center justify-center animate-fade-in"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <FaExclamationCircle className="text-emerald-500 text-3xl mb-3" />
      <h4 className="text-md font-bold opacity-90" style={{ color: 'var(--text)' }}>
        No Records Found
      </h4>
      <p className="text-xs mt-1 opacity-70 max-w-xs" style={{ color: 'var(--muted)' }}>
        We couldn't find any listings matching <span className="text-emerald-500 font-semibold italic">"{searchTerm}"</span> within this administrative category.
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen px-6 py-24"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Services in Multan</h1>
          <p style={{ color: 'var(--muted)' }}>
            Browse or contribute to local facilities dynamically.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddServiceClick}
            className="bg-emerald-600 text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-emerald-700 transition-all w-full sm:w-auto shadow-lg flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <FaPlus /> Add New Service
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-12">
          <AddService onAdd={handleAddService} onClose={() => setShowForm(false)} />
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      {/* CATEGORY CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {mainCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              navigate(`/services/${cat.id}`);
              setSearchTerm(''); 
              setTimeout(() => {
                listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className={`relative h-64 rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 border group ${
              location.pathname.includes(cat.id)
                ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-[1.02]'
                : 'border-transparent'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 blur-[2px]"
              style={{ backgroundImage: `url(${cat.bgImg})` }}
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-sm text-white/80">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DYNAMIC LIST SECTION */}
      <div 
        ref={listingsRef}
        className="max-w-4xl mx-auto border-t pt-10 scroll-mt-6" 
        style={{ borderColor: 'var(--border)' }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Syncing with system database records...</p>
          </div>
        ) : isSelected ? (
          <>
            {/* SEARCH INPUT */}
            <div className="mb-6 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                placeholder="Search in this category..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-transparent text-sm"
                style={{ borderColor: 'var(--border)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FIXED: Removed raw style variables; now completely handled by global CSS stylesheet */}
            <div className="w-full max-h-[60vh] pr-1.5 space-y-2 overflow-y-auto overflow-x-hidden selection:bg-emerald-500/10 custom-scrollbar">
              <Routes>
                <Route
                  path="hospitals"
                  element={
                    data.hospitals.length > 0 && filteredHospitals.length === 0 ? (
                      renderNoMatchesMessage()
                    ) : (
                      <Hospitals items={filteredHospitals} onEdit={handleEditServiceClick} />
                    )
                  }
                />
                <Route
                  path="restaurants"
                  element={
                    data.restaurants.length > 0 && filteredRestaurants.length === 0 ? (
                      renderNoMatchesMessage()
                    ) : (
                      <Restaurants items={filteredRestaurants} onEdit={handleEditServiceClick} />
                    )
                  }
                />
                <Route
                  path="parks"
                  element={
                    data.parks.length > 0 && filteredParks.length === 0 ? (
                      renderNoMatchesMessage()
                    ) : (
                      <Parks items={filteredParks} onEdit={handleEditServiceClick} />
                    )
                  }
                />
              </Routes>
            </div>
          </>
        ) : (
          <p
            className="text-center py-10 opacity-60 italic text-sm"
            style={{ color: 'var(--muted)' }}
          >
            Click on the services above to see real-time active listings.
          </p>
        )}
      </div>

      {showAuthWall && <AuthWallCard onClose={() => setShowAuthWall(false)} />}

      {editingService && (
        <ServiceUpdatePanel
          serviceData={editingService}
          onClose={() => setEditingService(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Services;