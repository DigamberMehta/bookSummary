import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../../context/authContext'; 

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/'); // Redirect to the homepage after logout
  };

  return (
    <div>
      <header className="bg-white border-b border-gray-100">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="ml-2 text-2xl font-serif font-semibold text-gray-900">
                Book Summaries
              </span>
            </div>

            {/* Conditional Rendering for Auth */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/auth">
                  <button className="rounded-lg px-5 py-2.5 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;