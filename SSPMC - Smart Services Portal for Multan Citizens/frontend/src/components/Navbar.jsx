import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../ContextAPIs/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  
  const token = localStorage.getItem('token');
  const hasToken = !!token;

  // Re-verify configuration profile settings whenever routes pivot or token shifts
  useEffect(() => {
    const fetchNavbarProfile = async () => {
      if (!hasToken) {
        setProfile(null);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;

        if (!userId) return;

        const response = await axios.get(`http://localhost:4000/api/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Navbar identity extraction fault:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          setProfile(null);
        }
      }
    };

    fetchNavbarProfile();

    // 👈 FIXED: Global Event Listener to catch image changes instantly without manual reloads
    const handleAvatarUpdate = (event) => {
      setProfile((prevProfile) => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          profilePic: event.detail // event.detail holds the new relative file string path
        };
      });
    };

    // Mount browser layout trigger listener
    window.addEventListener('avatarUpdated', handleAvatarUpdate);

    // Clean up event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, [location.pathname, hasToken, token]);

  // Unified rendering gate for avatar state configurations
  const renderAvatarCircle = () => {
    if (!hasToken) {
      return (
        <span className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center font-bold text-sm tracking-wide text-white cursor-pointer" title="Browsing as Guest">
          G
        </span>
      );
    }

    if (profile?.profilePic) {
      const imageSource = profile.profilePic.startsWith('data:') || profile.profilePic.startsWith('http')
        ? profile.profilePic
        : `http://localhost:4000${profile.profilePic}`;
      return (
        <img 
          src={imageSource} 
          alt="User Profile" 
          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
        />
      );
    }

    const fLetter = profile?.firstname ? profile.firstname[0].toUpperCase() : 'U';
    const lLetter = profile?.lastname ? profile.lastname[0].toUpperCase() : '';
    return (
      <span className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-500/10 flex items-center justify-center font-bold text-xs tracking-tight text-emerald-400 uppercase">
        {fLetter}{lLetter}
      </span>
    );
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: `var(--navdark)`,
        color: `var(--navtext)`,
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <nav className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg md:text-xl font-bold tracking-wide">
          <Link to="/" className="flex items-center gap-2" style={{ color: `var(--navtext)` }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/0/02/Multan_District_Government.jpg"
              alt="SSPMC Logo"
              className="w-10 h-10 rounded-full object-cover border shadow-sm"
            />
            <span>SSPMC</span>
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/home" className="hover:text-emerald-500 transition">Home</Link>
          <Link to="/services" className="hover:text-emerald-500 transition">Services</Link>
          <Link to="/about" className="hover:text-emerald-500 transition">About</Link>
          <Link to="/contact" className="hover:text-emerald-500 transition">Contact</Link>
          
          <Link to={hasToken ? "/profile" : "/login"} className="transition flex items-center gap-2">
            {renderAvatarCircle()}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full border transition-all cursor-pointer"
            style={{ borderColor: `var(--border)`, backgroundColor: `var(--card)` }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <FiMoon className="text-gray-400" /> : <FiSun className="text-yellow-400" />}
          </button>
        </div>

        {/* MOBILE MENU TRIGGER BUTTON */}
        <button className="md:hidden text-2xl cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* MOBILE EXPANDED TRAY */}
      {open && (
        <div
          className="md:hidden px-6 py-4 space-y-4 text-sm"
          style={{ backgroundColor: `var(--navdark)`, borderTop: `1px solid var(--border)`, color: `var(--navtext)` }}
        >
          <Link onClick={() => setOpen(false)} to="/home" className="block hover:text-emerald-500">Home</Link>
          <Link onClick={() => setOpen(false)} to="/services" className="block hover:text-emerald-500">Services</Link>
          <Link onClick={() => setOpen(false)} to="/about" className="block hover:text-emerald-500">About</Link>
          <Link onClick={() => setOpen(false)} to="/contact" className="block hover:text-emerald-500">Contact</Link>
          
          <Link onClick={() => setOpen(false)} to={hasToken ? "/profile" : "/login"} className="flex items-center gap-3 py-1 border-t border-white/5 pt-3">
            {renderAvatarCircle()}
            <span className="font-semibold text-white">{hasToken ? "Manage Profile Settings" : "Sign In / Register"}</span>
          </Link>

          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="flex items-center gap-2 w-full mt-2 px-3 py-2 rounded-md border text-left cursor-pointer"
            style={{ borderColor: `var(--border)`, backgroundColor: `var(--card)`, color: `var(--text)` }}
          >
            {theme === 'light' ? <><FiMoon /> Dark Mode</> : <><FiSun /> Light Mode</>}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;