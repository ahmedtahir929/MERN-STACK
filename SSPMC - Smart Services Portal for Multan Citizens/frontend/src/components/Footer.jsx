import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa6';
import { useTheme } from '../ContextAPIs/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import FooterNewsletter from './FooterNewsletter'; // Clean abstraction import here

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer
      className="mt-16 transition-colors duration-300"
      style={{ backgroundColor: 'var(--navdark)', color: 'var(--navtext)' }}
    >
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--navtext)' }}
          >
            Smart Services Portal for Multan Citizens (SSPMC)
          </h2>
          <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
            From the district administration of Multan:
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
            <li>View services (hospitals, restaurants, parks),</li>
            <li>Search services easily,</li>
            <li>Add new service entries</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3
            className="font-semibold mb-4"
            style={{ color: 'var(--navtext)' }}
          >
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/home" className="hover:text-emerald-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-emerald-500 transition">
                Services
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-emerald-500 transition">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-emerald-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3
            className="font-semibold mb-4"
            style={{ color: 'var(--navtext)' }}
          >
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://multan.punjab.gov.pk/dc-multan" className="hover:text-emerald-500 transition">
                Deputy Commissioner Multan
              </a>
            </li>
            <li>
              <a href="https://web.bisemultan.edu.pk/" className="hover:text-emerald-500 transition">
                Education Board
              </a>
            </li>
            <li>
              <a href="https://multan.punjab.gov.pk/district_profile" className="hover:text-emerald-500 transition">
                District Profile
              </a>
            </li>
            <li>
              <a href="https://multan.punjab.gov.pk/history_mtn" className="hover:text-emerald-500 transition">
                History of Multan
              </a>
            </li>
          </ul>
        </div>

        {/* Dynamic Newsletter Injected View block */}
        <FooterNewsletter />
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} SSPMC. All rights reserved.
          </p>

          {/* Social Icons & Theme Toggle */}
          <div className="flex space-x-4 items-center">
            {[
              {
                icon: <FaFacebookF />,
                hover: 'hover:bg-emerald-500',
                link: 'https://www.facebook.com/profile.php?id=61590544405416',
              },
              {
                icon: <FaXTwitter />,
                hover: 'hover:bg-emerald-500',
                link: 'https://x.com/AhmedTahir929',
              },
              {
                icon: <FaInstagram />,
                hover: 'hover:bg-emerald-500',
                link: 'https://www.instagram.com/ahmedtahir929pk/',
              },
              {
                icon: <FaLinkedinIn />,
                hover: 'hover:bg-emerald-500',
                link: 'https://www.linkedin.com/in/ahmedtahir929pk/',
              },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank" // Opens the link in a fresh, separate browser tab
                rel="noopener noreferrer" // Essential security practice to protect session window variables
                className={`p-2 rounded-full border transition-all cursor-pointer bg-white/5 border-white/10 text-white/70 ${social.hover} hover:text-white hover:border-transparent hover:scale-110`}
              >
                {social.icon}
              </a>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border shadow transition-all cursor-pointer hover:scale-110"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
              }}
              aria-label="Toggle Layout Theme"
            >
              {theme === 'light' ? (
                <FiMoon />
              ) : (
                <FiSun className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
