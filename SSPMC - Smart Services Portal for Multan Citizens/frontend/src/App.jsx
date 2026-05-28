import { Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// New Authentication Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OauthSuccess from './pages/OauthSuccess';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main content area expands to push footer down if page content is short */}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services/*" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Google OAuth Token Handler Route */}
          <Route path="/oauth-success" element={<OauthSuccess />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
