import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
        <Link to="/clipboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          My Clipboard
        </Link>
        <Link to="/create" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          New Snippet
        </Link>
      </nav>
    </header>
  );
};

export default Header;