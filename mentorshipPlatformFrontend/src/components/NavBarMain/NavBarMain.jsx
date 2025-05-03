import React, { useState } from "react";
import { Link } from "react-router-dom";
import {Button} from "@heroui/react";

const NavBarMain = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black bg-opacity-80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-bold">Career Sensei</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Help
            </a>
            <Link to="/auth/register" className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
              Register
            </Link>
            <Link
              to="/auth/login"
              className="bg-gray-700 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isOpen ? (
                <span className="text-xl font-bold">✖</span>
              ) : (
                <span className="text-xl font-bold">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-black bg-opacity-80`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Help
          </a>
          <button className="w-full bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-base font-medium transition duration-300">
            Register
          </button>
          <button className="w-full bg-gray-700 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-base font-medium transition duration-300">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBarMain;