import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FiCamera, FiLock, FiTrash2, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';

import UpdateUserProfileForm from '../components/UpdateUserProfileForm';
import ServicesAddedByUser from '../components/ServicesAddedByUser';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myServices, setMyServices] = useState([]);
  const [userId, setUserId] = useState(null);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: 'user',
    profilePic: null,
  });

  const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchProfileAndContributionData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const decodedToken = jwtDecode(token);
        const currentUserId = decodedToken.id || decodedToken._id;

        if (!currentUserId) {
          throw new Error('Invalid session structure. Please sign in again.');
        }

        setUserId(currentUserId);

        const profileRes = await axios.get(
          `http://localhost:4000/api/users/profile/${currentUserId}`,
        );
        const userData = profileRes.data;
        setUser(userData);

        const servicesRes = await axios.get(
          'http://localhost:4000/api/services',
        );
        const allServices = servicesRes.data;

        const filtered = allServices.filter(
          (item) =>
            item.createdBy === userData._id ||
            item.createdBy?._id === userData._id,
        );
        setMyServices(filtered);
      } catch (err) {
        const fallbackMsg =
          err.response?.data?.message ||
          'Failed to securely synchronize profile data.';
        setError(fallbackMsg);
        toast.error(fallbackMsg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndContributionData();
  }, [navigate]);

  // FIXED: Hydrated multi-part request headers payload with your Bearer verification string
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const activeSessionToken = getValidToken();
    if (!file || !activeSessionToken || !userId) return;

    const imgPayload = new FormData();
    imgPayload.append('profilePic', file);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/profile/avatar/${userId}`,
        imgPayload,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${activeSessionToken}` // Passes access authentication authorization token safely
          } 
        },
      );
      // Update local profile view state
      setUser((prev) => ({ ...prev, profilePic: response.data.profilePic }));
      window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: response.data.profilePic }));
      toast.success('Avatar updated successfully!');
    } catch (err) {
      console.error("Avatar Upload Fail:", err);
      toast.error(err.response?.data?.message || 'Failed to commit image asset.');
    }
  };

  const handleSaveProfileDetails = async (updatedFields) => {
    if (!getValidToken() || !userId) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/profile/update/${userId}`,
        updatedFields,
      );

      const updatedUserData = response.data.user;

      setUser((prev) => ({
        ...prev,
        firstname: updatedUserData.firstname,
        lastname: updatedUserData.lastname,
        email: updatedUserData.email,
      }));

      toast.success('Identity metrics committed successfully!');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Profile synchronization failure.',
      );
    }
  };

  const handleUpdatePassword = async () => {
    if (!getValidToken() || !userId) return;

    if (!securityForm.currentPassword || !securityForm.newPassword) {
      toast.warning('Please fill in both security fields.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/users/profile/update/password/${userId}`,
        securityForm,
      );
      toast.success('Security parameters refreshed cleanly!');
      setSecurityForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Security parameters update failed.',
      );
    }
  };

  const handleRemoveContribution = async (serviceId, serviceName) => {
    const confirmationGate = window.confirm(
      `Are you sure you want to permanently delete "${serviceName}" from the public SSPMC data tables?`,
    );
    if (!confirmationGate) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/services/delete/service/${serviceId}`,
      );
      setMyServices((prev) => prev.filter((item) => item._id !== serviceId));
      toast.success('Public service registry entry removed cleanly.');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to process database deletion request.',
      );
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to log out of the management console?',
    );
    if (confirmLogout) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      toast.info('Logged out safely. Continuing session as Guest.');
      navigate('/home');
    }
  };

  const handleDeleteAccount = async () => {
    if (!getValidToken() || !userId) return;

    const doubleCheck = window.confirm(
      'Warning: Are you absolutely sure you want to delete your account? This action terminates your session permanently.',
    );
    if (doubleCheck) {
      try {
        await axios.delete(
          `http://localhost:4000/api/users/profile/delete/${userId}`,
        );
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Account successfully deactivated.');
        navigate('/login');
      } catch (err) {
        toast.error('Failed to process profile deactivation sequence safely.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 mt-2">Hydrating parameters...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-24"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Account Settings
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Change your name and profile details, update your password, or manage your account safety.
        </p>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border-l-4 border-red-500 font-medium">
          {error}
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN PANEL */}
        <div className="space-y-6 lg:col-span-1">
          <div
            className="p-6 rounded-xl shadow-sm text-center flex flex-col items-center"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="relative group mb-4">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center bg-emerald-500/10"
                style={{ borderColor: 'var(--border)' }}
              >
                {user.profilePic ? (
                  <img
                    src={
                      user.profilePic.startsWith('data:') ||
                      user.profilePic.startsWith('http')
                        ? user.profilePic
                        : `http://localhost:4000${user.profilePic}`
                    }
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-emerald-500 uppercase">
                    {user.firstname ? user.firstname[0] : ''}
                    {user.lastname ? user.lastname[0] : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 cursor-pointer bg-emerald-500 text-white p-2 rounded-full shadow hover:bg-emerald-600 transition"
                title="Upload Photo"
              >
                <FiCamera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="text-xl font-semibold capitalize tracking-tight">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-sm px-3 py-1 rounded-full mt-2 inline-block bg-emerald-500/10 text-emerald-500 font-medium capitalize">
              Role: {user.role}
            </p>
          </div>

          <ServicesAddedByUser
            myServices={myServices}
            onRemove={handleRemoveContribution}
          />

          <div
            className="p-5 rounded-xl shadow-sm flex flex-col"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              className="text-md font-bold flex items-center gap-2 mb-3 border-b pb-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <FiLogOut className="text-emerald-500" /> Logout
            </h3>
            <p
              className="text-xs mb-3 opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              Click the button below to logout
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer"
            >
              <FiLogOut /> Sign Out of Session
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN PANELS */}
        <div className="lg:col-span-2 space-y-6">
          <UpdateUserProfileForm
            initialData={user}
            onSave={handleSaveProfileDetails}
          />

          <div
            className="p-6 rounded-xl shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiLock className="text-emerald-500" /> Security Access Control
            </h3>
            <hr style={{ borderColor: 'var(--border)' }} />

            <div>
              <label
                className="text-xs font-semibold block mb-2"
                style={{ color: 'var(--muted)' }}
              >
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={securityForm.currentPassword}
                onChange={(e) =>
                  setSecurityForm({
                    ...securityForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg focus:outline-none text-sm"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-2"
                style={{ color: 'var(--muted)' }}
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={securityForm.newPassword}
                onChange={(e) =>
                  setSecurityForm({
                    ...securityForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg focus:outline-none text-sm"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition text-white font-medium text-sm ml-auto"
            >
              Update Password
            </button>
          </div>

          <div
            className="p-6 rounded-xl shadow-sm border border-red-500/30"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 className="text-xl font-semibold text-red-500 flex items-center gap-2 mb-2">
              <FiTrash2 /> Danger Zone
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Once you confirm deletion, your account profile flags change to
              hidden. Your added public hospital/park/restaurant entries will
              remain attributed securely to system nodes.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 rounded-lg border-2 cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-medium text-sm"
            >
              Delete SSPMC Account Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;