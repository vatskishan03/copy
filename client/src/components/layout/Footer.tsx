import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 dark:bg-slate-900 text-white py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="flex space-x-4">
          <Link to="/" className="text-sm hover:text-blue-200">
            Home
          </Link>
          <Link to="/about" className="text-sm hover:text-blue-200">
            About
          </Link>
          <Link to="/privacy" className="text-sm hover:text-blue-200">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm hover:text-blue-200">
            Terms
          </Link>
        </div>
        <div className="text-center text-sm">
          &copy; {currentYear} ClipSync Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;