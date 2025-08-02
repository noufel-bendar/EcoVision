import React, { useState } from 'react';
import { FiUser, FiLogOut, FiHome, FiBarChart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  const handleNavigation = (path) => {
    setShowMenu(false);
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
    <header className="w-full bg-logoGreen shadow-md fixed top-0 left-0 z-50 h-20">
      <div className="w-full h-full px-0 flex items-center justify-between">

        <div className="flex items-center space-x-2 pl-4 cursor-pointer" onClick={() => handleNavigation('home')}>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-logoGreen font-bold text-lg">EV</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">EcoVision</span>
        </div>

        <div className="flex items-center space-x-6 pr-4">
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-white hover:text-gray-100 font-medium transition flex items-center space-x-1"
            >
              <FiHome />
              <span>Home</span>
            </button>
            <button 
              onClick={() => handleNavigation('home')}
              className="text-white hover:text-gray-100 font-medium transition flex items-center space-x-1"
            >
              <FiBarChart />
              <span>Dashboard</span>
            </button>
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="text-white text-2xl focus:outline-none hover:text-gray-100 transition"
            >
              <FiUser />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-md shadow-lg py-2 z-50">
                <button 
                  onClick={() => handleNavigation('home')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
