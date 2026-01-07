import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Wipronix
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering businesses with innovative technology solutions. We build the future of digital experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <FaLinkedinIn />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/home" className="text-gray-400 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 flex items-center">
                <span className="mr-2">›</span> Web Development
              </li>
              <li className="text-gray-400 flex items-center">
                <span className="mr-2">›</span> Mobile App Development
              </li>
              <li className="text-gray-400 flex items-center">
                <span className="mr-2">›</span> Cloud Solutions
              </li>
              <li className="text-gray-400 flex items-center">
                <span className="mr-2">›</span> Digital Marketing
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-indigo-500 shrink-0" />
                <span className="text-gray-400">123 Tech Park, Innovation Street, Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-indigo-500 shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-indigo-500 shrink-0" />
                <span className="text-gray-400">info@wipronix.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center bg-gray-900">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Wipronix. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Terms of Service</a>
            <a href="/employee-portal/login" className="text-gray-500 hover:text-indigo-400 text-sm transition">Employee Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
