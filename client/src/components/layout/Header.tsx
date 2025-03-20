import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import  Button  from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 dark:bg-slate-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-mono font-bold">
          ClipSync Pro
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="#" className="hover:text-blue-200">
            How to Use
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="ghost"
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-blue-600 dark:bg-slate-900 p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
              <Link to="#" className="hover:text-blue-200">
                How to Use
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;