"use client";

import Link from "next/link";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Freshmarket
      </Link>

      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-600 hover:text-green-600">
          Home
        </Link>
        <Link href="/categories" className="text-gray-600 hover:text-green-600">
          Categories
        </Link>
        <Link href="/deals" className="text-gray-600 hover:text-green-600">
          Deals
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products...."
            className="pl-10 pr-4 py-1 border rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <FiUser className="text-x1 text-gray-600 hover:text-green-600 cursor-pointer" />
        <FiShoppingCart className="text-x1 text-gray-600 hover:text-green-600 cursor-pointer" />
      </div>
    </nav>
  );
}
