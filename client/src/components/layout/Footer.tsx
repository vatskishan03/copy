import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-100 py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="flex space-x-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
            Terms
          </Link>
        </div>
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Clipboard App. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
            Twitter
          </a>
          <a href="https://github.com" className="text-gray-600 hover:text-gray-900">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;