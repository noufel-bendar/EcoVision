import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="w-full bg-logoGreen shadow-md fixed top-0 left-0 z-50 h-20">
      <div className="w-full h-full px-0 flex items-center justify-between">

        <div className="flex items-center space-x-2 pl-4">
          <img
            src="/src/assets/images/2-tx-bg.png"
            alt="EcoVision Logo"
            className="h-40 w-auto mt-4"
          />
          <span className="text-2xl font-bold text-white tracking-wide">EcoVision</span>
        </div>

        <div className="flex items-center space-x-6 pr-4">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-100 font-medium transition">Home</a>
            <a href="#" className="text-white hover:text-gray-100 font-medium transition">Dashboard</a>
            <a href="#" className="text-white hover:text-gray-100 font-medium transition">About</a>
          </nav>


          <div className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="text-white text-2xl focus:outline-none"
            >
              <FiUser />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-md shadow-lg py-2 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Info
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
