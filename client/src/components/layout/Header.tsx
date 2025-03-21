// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Button from '../ui/Button';
// import { ThemeToggle } from '../ui/ThemeToggle';

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-blue-600 dark:bg-slate-900 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link to="/" className="text-xl font-mono font-bold">
//           ClipSync Pro
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-4">
//           <Link to="/" className="hover:text-blue-200">
//             Home
//           </Link>
//           <Link to="#" className="hover:text-blue-200">
//             How to Use
//           </Link>
//           <ThemeToggle /> {/* Dark Mode Toggle */}
//         </nav>

//         {/* Mobile Menu Button */}
//         <Button
//           className="md:hidden"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           variant="ghost"
//         >
//           <span className="sr-only">Open menu</span>
//           <svg
//             className="h-6 w-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//             />
//           </svg>
//         </Button>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="absolute top-16 right-0 left-0 bg-blue-600 dark:bg-slate-900 p-4 md:hidden">
//             <nav className="flex flex-col space-y-4">
//               <Link to="/" className="hover:text-blue-200">
//                 New Clipboard
//               </Link>
//               <Link to="#" className="hover:text-blue-200">
//                 How to Use
//               </Link>
//               <Link to="/about" className="hover:text-blue-200">
//                 About
//               </Link>
//               <Link to="/privacy" className="hover:text-blue-200">
//                 Privacy Policy
//               </Link>
//               <Link to="/terms" className="hover:text-blue-200">
//                 Terms of Service
//               </Link>
//               <Link to="/contact" className="hover:text-blue-200">
//                 Contact Us
//               </Link>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Menu } from 'lucide-react'; // Add this import

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 dark:bg-slate-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-mono font-bold">
          ClipSync Pro
        </Link>

        {/* Navigation Icons (Both Desktop and Mobile) */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-blue-700 dark:hover:bg-slate-800"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <ThemeToggle />
        </div>

        {/* Menu Dropdown (Shows on menu click) */}
        {isMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-blue-600 dark:bg-slate-900 p-4 z-50">
            <nav className="flex flex-col space-y-4 container mx-auto">
              <Link to="/" className="hover:text-blue-200">
                New Clipboard
              </Link>
              <Link to="#" className="hover:text-blue-200">
                How to Use
              </Link>
              <Link to="/about" className="hover:text-blue-200">
                About
              </Link>
              <Link to="/privacy" className="hover:text-blue-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blue-200">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-blue-200">
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;