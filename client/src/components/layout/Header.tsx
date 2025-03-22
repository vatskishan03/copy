import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 dark:bg-slate-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-mono font-bold text-white dark:text-amber-200">
          CopyIt
        </Link>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;