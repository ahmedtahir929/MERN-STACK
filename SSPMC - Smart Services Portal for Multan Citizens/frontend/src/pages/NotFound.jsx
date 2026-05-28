import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <h1 className="text-9xl font-extrabold text-emerald-500 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Oops! Page Not Found</h2>
      <p className="max-w-md mb-8 opacity-70" style={{ color: 'var(--muted)' }}>
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      <Link
        to="/home"
        className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all shadow-lg font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;