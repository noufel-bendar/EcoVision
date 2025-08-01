import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-logoGreen text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-16">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">EcoVision</h2>
          <p className="text-sm text-white/80 mb-4">
            Join the movement to recycle, reduce waste, and build a greener future.
          </p>
          <p className="text-xs text-white/60">&copy; {new Date().getFullYear()} EcoVision. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Dashboard</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Account</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-white text-logoGreen rounded-full hover:bg-gray-200 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 bg-white text-logoGreen rounded-full hover:bg-gray-200 transition">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-white text-logoGreen rounded-full hover:bg-gray-200 transition">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 bg-white text-logoGreen rounded-full hover:bg-gray-200 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
