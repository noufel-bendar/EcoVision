import React, { useState } from 'react';
import { FiUser, FiLogOut, FiHome, FiBarChart, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logoText from '../assets/images/2-tx-bg.png';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  const handleNavigation = (path) => {
    setShowMenu(false);
    setShowMobileMenu(false);
    if (path === 'home') {
      const userType = localStorage.getItem('user_type');
      if (userType === 'seller') {
        navigate('/seller');
      } else if (userType === 'buyer') {
        navigate('/buyer');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <header className="w-full bg-logoGreen shadow-md fixed top-0 left-0 z-50 h-16 sm:h-20">
      <div className="w-full h-full px-2 sm:px-4 lg:px-6 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => handleNavigation('home')}
        >
          <img
            src={logoText}
            alt="EcoVision Logo"
            className="h-8 w-auto sm:h-12 md:h-16 lg:h-20"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide hidden sm:block">
            EcoVision
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <button 
            onClick={() => handleNavigation('home')}
            className="text-white hover:text-gray-100 font-medium transition flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <FiHome className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => handleNavigation('home')}
            className="text-white hover:text-gray-100 font-medium transition flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <FiBarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* User Menu and Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Desktop User Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="text-white text-xl focus:outline-none hover:text-gray-100 transition p-2 rounded-lg hover:bg-white/10"
            >
              <FiUser />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <button 
                  onClick={() => handleNavigation('home')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className="md:hidden text-white text-xl focus:outline-none hover:text-gray-100 transition p-2 rounded-lg hover:bg-white/10"
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={() => handleNavigation('home')}
              className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 transition-colors rounded-lg flex items-center space-x-3"
            >
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => handleNavigation('home')}
              className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 transition-colors rounded-lg flex items-center space-x-3"
            >
              <FiBarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <hr className="my-2 border-gray-200" />
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-base text-red-600 hover:bg-gray-100 transition-colors rounded-lg flex items-center space-x-3"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
