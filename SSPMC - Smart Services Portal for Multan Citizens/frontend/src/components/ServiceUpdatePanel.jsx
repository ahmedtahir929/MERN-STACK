import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiX, FiSave, FiInfo, FiUploadCloud, FiLink } from 'react-icons/fi';

const ServiceUpdatePanel = ({ serviceData, onClose, onUpdateSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [imageType, setImageType] = useState('url'); 
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'hospital',
    address: '', // Will be mapped to location.address on submission
    imageUrl: '',
    rating: 0,
  });

  // Hydrate input fields cleanly using the exact data mapping of your nested document schema
  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || '',
        category: serviceData.category || 'hospital',
        address: serviceData.location?.address || '', // Extracted from nested path
        imageUrl: serviceData.imageUrl || '',
        rating: serviceData.rating || 0,
      });
      // Fallback selector check if the initial document holds a local file string assignment
      if (serviceData.imageUpload) {
        setImageType('file');
      }
    }
  }, [serviceData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceData?._id) return;

    setSubmitting(true);

    // Build the dynamic Multi-Part Form Data pipeline payload to match AddService structure
    const updatePayload = new FormData();
    updatePayload.append('name', formData.name.trim());
    updatePayload.append('category', formData.category.toLowerCase());
    updatePayload.append('address', formData.address.trim()); // Handled by your backend mapping for location.address
    updatePayload.append('rating', formData.rating);

    if (imageType === 'url') {
      updatePayload.append('imageUrl', formData.imageUrl.trim());
      updatePayload.append('imageUpload', ''); // Clear out old files if switching strategy
    } else if (imageType === 'file') {
      if (selectedFile) {
        updatePayload.append('imageUpload', selectedFile); // Append raw file buffer
      } else {
        // If they didn't pick a new file, retain the current string pointer reference
        updatePayload.append('imageUpload', serviceData.imageUpload || '');
      }
      updatePayload.append('imageUrl', ''); // Clear out old URLs if switching strategy
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/services/update/service/${serviceData._id}`,
        updatePayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Authenticate session tracking for your updatedBy collection array
          },
        }
      );

      toast.success(response.data.message);
      
      // Pass the fully updated schema layout document chunk back up to refresh array state hooks instantly
      onUpdateSuccess(response.data.service || response.data);
      onClose();
    } catch (err) {
      console.error('Service update operational crash:', err);
      toast.error(err.response?.data?.message || 'Failed to map patch updates onto data cluster.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        {/* MODAL HEADER */}
        <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FiInfo className="text-emerald-500" /> Modify Service
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* COMPONENT CONTENT FORM */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SERVICE NAME */}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--muted)' }}>
                Service Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            {/* CATEGORY SELECTOR ENUM */}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--muted)' }}>
                Category Allocation
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none text-sm cursor-pointer"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <option value="hospital">Hospital</option>
                <option value="restaurant">Restaurant</option>
                <option value="park">Park</option>
              </select>
            </div>
          </div>

          {/* NESTED SCHEMATIC LOCATION ADDRESS */}
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--muted)' }}>
              Physical Address Location
            </label>
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* COMPOSITE IMAGE MANAGEMENT STRATEGY */}
          <div className="border p-4 rounded-lg space-y-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider mb-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" checked={imageType === 'url'} 
                  onChange={() => setImageType('url')} className="accent-emerald-500" 
                />
                <FiLink /> Image URL Link
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" checked={imageType === 'file'} 
                  onChange={() => setImageType('file')} className="accent-emerald-500" 
                />
                <FiUploadCloud /> Replace Local File
              </label>
            </div>

            {imageType === 'url' ? (
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
                style={{ borderColor: 'var(--border)' }}
              />
            ) : (
              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {serviceData.imageUpload && !selectedFile && (
                  <p className="text-xs opacity-60 italic pl-1" style={{ color: 'var(--muted)' }}>
                    Currently using active server file asset.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RATING SLIDER SCALE (1-5) */}
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--muted)' }}>
              Baseline Rating Summary Score ({formData.rating})
            </label>
            <input
              required
              type="range"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full h-2 rounded-lg bg-transparent accent-emerald-500 cursor-pointer border"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* ACTION BUTTON WRAPPER */}
          <div className="flex gap-2 justify-end pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2 rounded-lg border hover:bg-white/5 transition-colors text-sm cursor-pointer disabled:opacity-50 font-medium"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors font-semibold text-sm cursor-pointer shadow-md shadow-emerald-500/10"
            >
              {submitting ? 'Syncing...' : 'Save Updates'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ServiceUpdatePanel;