import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const OauthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Store token securely in local storage
      localStorage.setItem('token', token);

      // Set default headers for all subsequent Axios requests instantly
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect user to the actual home page instead of a non-existent dashboard
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="text-center max-w-sm w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        {/* Clean CSS Loading Spinner using your theme color */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>

        <h3 className="text-lg font-bold text-gray-800 tracking-tight">
          Securing Connection
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Authenticating your district console credentials. Please wait...
        </p>
      </div>
    </div>
  );
};

export default OauthSuccess;
