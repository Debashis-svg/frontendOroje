import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-white border-t border-blue-100 text-gray-700 py-8 shadow-inner">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm md:text-base font-medium">
          &copy; 2025-2026 <span className="text-blue-600 font-semibold">NIT Silchar</span>. All rights reserved.
        </p>
        <p className="text-xs md:text-sm mt-1 text-gray-500">
          A <span className="text-blue-600 font-medium">Software Engineering Course</span> Project.
        </p>

        <div className="mt-4 flex justify-center space-x-4">
          <span className="w-2 h-2 bg-blue-400 rounded-full shadow-sm shadow-blue-200 animate-pulse"></span>
          <span className="w-2 h-2 bg-teal-400 rounded-full shadow-sm shadow-teal-200 animate-pulse"></span>
          <span className="w-2 h-2 bg-indigo-400 rounded-full shadow-sm shadow-indigo-200 animate-pulse"></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
