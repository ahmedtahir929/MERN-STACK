import { useState } from 'react';
import axios from 'axios';

const AddService = ({ onAdd, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Choose between URL input or File attachment
  const [imageType, setImageType] = useState('url'); 
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Hospital',
    address: '',
    imageUrl: '',
    rating: 5,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field integrity verification checks
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please fill in the core service details.');
      return;
    }

    if (imageType === 'url' && !formData.imageUrl.trim()) {
      setError('Please provide an image link URL.');
      return;
    }

    if (imageType === 'file' && !selectedFile) {
      setError('Please choose a local image file to upload.');
      return;
    }

    setLoading(true);

    // Setup multi-part stream payload payload parameters
    const submissionPayload = new FormData();
    submissionPayload.append('name', formData.name);
    submissionPayload.append('category', formData.category.toLowerCase()); // Lowercase matching backend enum contract
    submissionPayload.append('address', formData.address);
    submissionPayload.append('rating', formData.rating);

    if (imageType === 'url') {
      submissionPayload.append('imageUrl', formData.imageUrl);
    } else {
      submissionPayload.append('imageUpload', selectedFile); // Tied straight to Multer key
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/services/add-service',
        submissionPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Token hydration falls back gracefully if state initialization missed it
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Inform parent view container layout to refresh active dynamic arrays
        onAdd(response.data.service || response.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register the new service entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto mb-10 p-6 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <h2 className="text-xl font-bold mb-4">Add New Service Entry</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Service Name */}
          <div>
            <label className="block text-sm mb-1 font-medium">Service Name</label>
            <input
              required
              type="text"
              name="name"
              placeholder="e.g. Nishtar Hospital"
              className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
              style={{ borderColor: 'var(--border)' }}
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm mb-1 font-medium">Category</label>
            <select
              name="category"
              className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none text-sm cursor-pointer"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)',
              }}
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="Hospital">Hospital</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Park">Park</option>
            </select>
          </div>
        </div>

        {/* Description / Location Address */}
        <div>
          <label className="block text-sm mb-1 font-medium">Physical Address Location</label>
          <input
            required
            type="text"
            name="address"
            placeholder="e.g. Nishtar Road, Gillani Colony, Multan"
            className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
            style={{ borderColor: 'var(--border)' }}
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        {/* Image Input Strategy Switcher */}
        <div className="border p-4 rounded-lg space-y-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider mb-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" checked={imageType === 'url'} 
                onChange={() => setImageType('url')} className="accent-emerald-500" 
              />
              Paste Image URL Link
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" checked={imageType === 'file'} 
                onChange={() => setImageType('file')} className="accent-emerald-500" 
              />
              Upload Local File
            </label>
          </div>

          {imageType === 'url' ? (
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/images/nishtar.jpg"
              className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
              style={{ borderColor: 'var(--border)' }}
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              onChange={handleFileChange}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          {/* Service Rating */}
          <div>
            <label className="block text-sm mb-1 font-medium">Initial Baseline Rating (1-5)</label>
            <input
              required
              type="number"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              className="w-full px-4 py-2 rounded-lg bg-transparent border focus:outline-none focus:border-emerald-500 text-sm"
              style={{ borderColor: 'var(--border)' }}
              value={formData.rating}
              onChange={handleInputChange}
            />
          </div>

          {/* Form Trigger Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors font-semibold text-sm cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Add Service'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border hover:bg-white/5 transition-colors text-sm cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddService;