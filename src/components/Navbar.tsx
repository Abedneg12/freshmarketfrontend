'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  ShoppingBagIcon
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();

  // Dummy user data
  const user = {
    isLoggedIn: true,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80'
  };

  const totalItems = 3;

  const logout = () => {
    console.log('Dummy logout');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-green-600 font-bold text-2xl">
          FreshMart
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-green-600">
            Home
          </Link>
          <Link href="/catalog" className="text-gray-700 hover:text-green-600">
            Categories
          </Link>
          <Link href="/catalog?deals=true" className="text-gray-700 hover:text-green-600">
            Deals
          </Link>
        </nav>

        {/* Search & Profile & Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              {user.isLoggedIn ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border-2 border-green-500 object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold text-sm text-black">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black">
                  Your Profile
                </Link>
                <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black">
                  Order History
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative text-gray-700 hover:text-green-600">
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
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-400"
          />
          <SearchIcon className="absolute left-6 top-[74px] h-4 w-4 text-gray-400" />
          <Link href="/" className="block text-gray-700">
            Home
          </Link>
          <Link href="/catalog" className="block text-gray-700">
            Categories
          </Link>
          <Link href="/catalog?deals=true" className="block text-gray-700">
            Deals
          </Link>
          <Link href="/orders" className="block text-gray-700">
            Orders
          </Link>
          {user.isLoggedIn ? (
            <button
              onClick={logout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="block w-full text-center bg-green-600 text-white py-2 rounded-full text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
