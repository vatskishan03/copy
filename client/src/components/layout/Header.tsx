import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { LogoutOptions } from '@auth0/auth0-react';

const Header: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-gray-100 px-4 py-2">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Clipboard
        </Link>
      </div>
      <nav className="flex space-x-4">
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Home
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/clipboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              My Clipboard
            </Link>
            <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </>
        )}
      </nav>
      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Log In
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Hello, {user?.name}</span>
            <button
              onClick={() => logout({ returnTo: window.location.origin } as LogoutOptions)}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;