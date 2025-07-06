'use client';

import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaCompass, FaUser } from 'react-icons/fa';

interface NavbarProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

export default function Navbar({ showMenu, setShowMenu }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger menu for mobile */}
            <button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="sr-only">Open sidebar</span>
              <GiHamburgerMenu className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
              Super Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
              <FaCompass className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <FaUser className="h-5 w-5" />
                </div>
                <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                  Admin User
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}