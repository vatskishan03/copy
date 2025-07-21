import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 dark:bg-slate-900 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          Built by{" "}
          <a
            href="https://heykishan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-blue-200"
          >
            @Kishan
          </a>
        </p>
        <p className="text-sm mt-2">
          &copy; {currentYear} CopyIt. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;