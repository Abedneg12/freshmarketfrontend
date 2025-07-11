"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
} from "lucide-react";
import Cookies from "js-cookie";

// 1. Impor semua hook dan action yang diperlukan dari Redux
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { fetchUserProfile, logoutUser } from "@/lib/redux/slice/authSlice";
import { fetchCartCount, clearCartOnLogout } from "@/lib/redux/slice/cartSlice";

const defaultAvatarSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 2. Ambil semua data dinamis yang dibutuhkan dari Redux store
  const {
    user,
    isAuthenticated, // Gunakan isAuthenticated dari authSlice Anda
  } = useAppSelector((state) => state.auth);
  const { totalQuantity } = useAppSelector((state) => state.cart);

  // 3. useEffect untuk memeriksa sesi dan mengambil data profil & keranjang
  useEffect(() => {
    // Coba ambil profil jika ada token di local storage
    const token = localStorage.getItem("token");
    if (token && !user) {
      // Hanya fetch jika user belum ada di state
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Ambil jumlah keranjang setiap kali status autentikasi menjadi true
    if (isAuthenticated) {
      dispatch(fetchCartCount());
    }
  }, [isAuthenticated, dispatch]);

  // 4. Buat fungsi logout yang bersih
  const handleLogout = () => {
    dispatch(logoutUser()); // Membersihkan state auth
    dispatch(clearCartOnLogout()); // Membersihkan state cart
    Cookies.remove("auth_token"); // Hapus token dari cookie
    setIsProfileDropdownOpen(false); // Tutup dropdown
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-green-600 font-bold text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
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
          <Link
            href="/catalog?deals=true"
            className="text-gray-700 hover:text-green-600"
          >
            Deals
          </Link>
        </nav>

        {/* Search & Profile & Cart (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Profile Section (Dinamis) */}
          <div className="relative">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <img
                    src={user.profilePicture || defaultAvatarSvg}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full border-2 border-green-500 object-cover"
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-sm text-black">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-black"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-black"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="p-2">
                <UserIcon className="h-6 w-6 text-gray-700" />
              </Link>
            )}
          </div>

          {/* Cart Section (Dinamis) */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-green-600"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {isAuthenticated && totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700"
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu (Dinamis) */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-400"
            />
            <SearchIcon className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-700"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-700"
          >
            Categories
          </Link>
          <Link
            href="/catalog?deals=true"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-700"
          >
            Deals
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href={"/profile"}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700"
              >
                Profile
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700"
              >
                Orders
              </Link>
            </>
          )}
          <div className="border-t pt-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-green-600 text-white py-2 rounded-full text-sm"
              >
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
