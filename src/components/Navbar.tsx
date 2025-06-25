"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  ShoppingBagIcon,
  HeartIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-green-600 font-bold text-2xl">
            FreshMart
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
            Home
          </Link>
          <Link href="/catalog" className="text-gray-700 hover:text-green-600 transition-colors">
            Categories
          </Link>
          <Link href="/catalog?deals=true" className="text-gray-700 hover:text-green-600 transition-colors">
            Deals
          </Link>
        </nav>

        {/* Search, User, and Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              {user?.isLoggedIn ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <UserIcon className="h-6 w-6" />
              )}
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {user?.isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign In
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/cart" className="text-gray-700 hover:text-green-600 transition-colors relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {user?.isLoggedIn && (
              <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            <Link href="/" className="text-gray-700 py-2 border-b border-gray-100">
              Home
            </Link>
            <Link href="/catalog" className="text-gray-700 py-2 border-b border-gray-100">
              Categories
            </Link>
            <Link href="/catalog?deals=true" className="text-gray-700 py-2 border-b border-gray-100">
              Deals
            </Link>
            <div className="flex justify-between items-center py-2">
              <Link href="/profile" className="flex items-center space-x-2 text-gray-700">
                <UserIcon className="h-5 w-5" />
                <span>Account</span>
              </Link>
              <Link href="/cart" className="flex items-center space-x-2 text-gray-700">
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Cart ({totalItems})</span>
              </Link>
            </div>
            <Link href="/orders" className="flex items-center space-x-2 text-gray-700 py-2 border-b border-gray-100">
              <ShoppingBagIcon className="h-5 w-5" />
              <span>Orders</span>
            </Link>
            {user?.isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm font-medium transition-colors text-center">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
