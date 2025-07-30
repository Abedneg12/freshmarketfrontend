// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   ShoppingCartIcon,
//   UserIcon,
//   MenuIcon,
//   XIcon,
//   SearchIcon,
// } from "lucide-react";

// // 1. Impor semua hook dan action yang diperlukan dari Redux
// import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
// import { fetchProfile } from "@/lib/redux/slice/profileSlice";
// import { logoutAction } from "@/lib/redux/slice/authSlice";
// import { fetchCartCount, clearCartOnLogout } from "@/lib/redux/slice/cartSlice";

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   // 2. Ambil semua data dinamis yang dibutuhkan dari Redux store
//   const { isAuthenticated } = useAppSelector((state) => state.auth);
//   const profile = useAppSelector((state) => state.profile);
//   const { totalQuantity } = useAppSelector((state) => state.cart);

//   // 3. useEffect untuk memeriksa sesi dan mengambil data profil & keranjang
//   useEffect(() => {
//     // Coba ambil profil jika ada token di local storage
//     const token = localStorage.getItem("token");
//     if (token && !profile) {
//       // Hanya fetch jika user belum ada di state
//       dispatch(fetchProfile());
//     }
//   }, [dispatch, profile]);

//   useEffect(() => {
//     // Ambil jumlah keranjang setiap kali status autentikasi menjadi true
//     if (isAuthenticated) {
//       dispatch(fetchCartCount());
//     }
//   }, [isAuthenticated, dispatch]);

//   // 4. Buat fungsi logout yang bersih
//   const handleLogout = () => {
//     dispatch(logoutAction()); // Membersihkan state auth
//     dispatch(clearCartOnLogout()); // Membersihkan state cart
//     setIsProfileDropdownOpen(false); // Tutup dropdown
//     router.push("/");
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-sm">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-green-600 font-bold text-2xl"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           FreshMart
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-8">
//           <Link href="/" className="text-gray-700 hover:text-green-600">
//             Home
//           </Link>
//           <Link href="/catalog" className="text-gray-700 hover:text-green-600">
//             Categories
//           </Link>
//           <Link
//             href="/catalog?deals=true"
//             className="text-gray-700 hover:text-green-600"
//           >
//             Deals
//           </Link>
//         </nav>

//         {/* Search & Profile & Cart (Desktop) */}
//         <div className="hidden md:flex items-center space-x-6">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-500"
//             />
//             <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           </div>

//           {/* Profile Section (Dinamis) */}
//           <div className="relative">
//             {isAuthenticated && profile ? (
//               <>
//                 <button
//                   onClick={() =>
//                     setIsProfileDropdownOpen(!isProfileDropdownOpen)
//                   }
//                 >
//                   <img
//                     src={profile.profilePicture}
//                     alt={profile.fullName }
//                     className="h-8 w-8 rounded-full border-2 border-green-500 object-cover"
//                   />
//                 </button>
//                 {isProfileDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
//                     <div className="px-4 py-2 border-b">
//                       <p className="font-semibold text-sm text-black">
//                         {profile.fullName}
//                       </p>
//                       <p className="text-xs text-gray-500">{profile.email}</p>
//                     </div>
//                     <Link
//                       href="/profile"
//                       onClick={() => setIsProfileDropdownOpen(false)}
//                       className="block px-4 py-2 text-sm hover:bg-gray-100 text-black"
//                     >
//                       Your Profile
//                     </Link>
//                     <Link
//                       href="/orders"
//                       onClick={() => setIsProfileDropdownOpen(false)}
//                       className="block px-4 py-2 text-sm hover:bg-gray-100 text-black"
//                     >
//                       Order History
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link href="/login" className="p-2">
//                 <UserIcon className="h-6 w-6 text-gray-700" />
//               </Link>
//             )}
//           </div>

//           {/* Cart Section (Dinamis) */}
//           <Link
//             href="/cart"
//             className="relative text-gray-700 hover:text-green-600"
//           >
//             <ShoppingCartIcon className="h-6 w-6" />
//             {isAuthenticated && totalQuantity > 0 && (
//               <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                 {totalQuantity}
//               </span>
//             )}
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="md:hidden text-gray-700"
//         >
//           {isMenuOpen ? (
//             <XIcon className="h-6 w-6" />
//           ) : (
//             <MenuIcon className="h-6 w-6" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu (Dinamis) */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-400"
//             />
//             <SearchIcon className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
//           </div>
//           <Link
//             href="/"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-gray-700"
//           >
//             Home
//           </Link>
//           <Link
//             href="/catalog"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-gray-700"
//           >
//             Categories
//           </Link>
//           <Link
//             href="/catalog?deals=true"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-gray-700"
//           >
//             Deals
//           </Link>
//           <Link
//             href="/orders"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-gray-700"
//           >
//             Orders
//           </Link>
//           <div className="border-t pt-3">
//             {isAuthenticated ? (
//               <button
//                 onClick={handleLogout}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm"
//               >
//                 Sign Out
//               </button>
//             ) : (
//               <Link
//                 href="/login"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block w-full text-center bg-green-600 text-white py-2 rounded-full text-sm"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { fetchProfile } from "@/lib/redux/slice/profileSlice";
import { logoutAction } from "@/lib/redux/slice/authSlice";
import { fetchCartCount, clearCartOnLogout } from "@/lib/redux/slice/cartSlice";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const profile = useAppSelector((state) => state.profile);
  const { totalQuantity } = useAppSelector((state) => state.cart);

  // Ambil profil jika login dan belum ada di redux
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !profile?.fullName) {
      dispatch(fetchProfile());
    }
    // eslint-disable-next-line
  }, [dispatch, profile]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartCount());
    }
  }, [isAuthenticated, dispatch]);

  // Close profile dropdown kalau klik di luar
  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [isProfileDropdownOpen]);

  // Keyboard a11y for dropdown
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileDropdownOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logoutAction());
    dispatch(clearCartOnLogout());
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  // Untuk pencarian (tidak harus, bisa dihandle parent)
  const [search, setSearch] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(search)}`);
      setSearch("");
      setIsMenuOpen(false);
    }
  };

  // ====== UI ======
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-green-600 font-bold text-2xl tracking-tight flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <ShoppingCartIcon className="h-7 w-7 mr-2" />
          FreshMart
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/catalog" className="nav-link">
            Categories
          </Link>
          <Link href="/catalog?deals=true" className="nav-link">
            Deals
          </Link>
        </nav>

        {/* Search & Profile & Cart (Desktop) */}
        <div className="hidden md:flex items-center space-x-5">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 text-gray-400 hover:text-green-500"
              aria-label="Search"
              tabIndex={-1}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>

          {/* Profile Section */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated && profile?.fullName ? (
              <>
                <button
                  onClick={() => setIsProfileDropdownOpen((s) => !s)}
                  className="focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full"
                  aria-label="Profile menu"
                >
                  <img
                    src={profile.profilePicture || "https://i.pravatar.cc/40?u=user"}
                    alt={profile.fullName}
                    className="h-9 w-9 rounded-full border-2 border-green-500 object-cover bg-gray-100"
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 animate-fadein-fast overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="font-bold text-sm text-gray-900">{profile.fullName}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 transition"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 transition"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-medium transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="p-2 rounded-full hover:bg-green-50 transition">
                <UserIcon className="h-7 w-7 text-gray-700" />
              </Link>
            )}
          </div>

          {/* Cart Section */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-green-600 transition"
          >
            <ShoppingCartIcon className="h-7 w-7" />
            {isAuthenticated && totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow animate-bounce-slow">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((s) => !s)}
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full"
        >
          {isMenuOpen ? (
            <XIcon className="h-7 w-7" />
          ) : (
            <MenuIcon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3 animate-fadein-fast">
          <form onSubmit={handleSearch} className="relative mb-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
            <button
              type="submit"
              className="absolute left-4 top-2.5 text-gray-400 hover:text-green-500"
              aria-label="Search"
              tabIndex={-1}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-2 text-gray-700 rounded hover:bg-green-50 transition"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-2 text-gray-700 rounded hover:bg-green-50 transition"
          >
            Categories
          </Link>
          <Link
            href="/catalog?deals=true"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-2 text-gray-700 rounded hover:bg-green-50 transition"
          >
            Deals
          </Link>
          <Link
            href="/orders"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-2 text-gray-700 rounded hover:bg-green-50 transition"
          >
            Orders
          </Link>
          <div className="border-t pt-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm font-bold transition"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-green-600 text-white py-2 rounded-full text-sm font-bold transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .nav-link {
          color: #374151;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #16a34a;
        }
        .animate-fadein-fast {
          animation: fadeInFast 0.2s;
        }
        .animate-bounce-slow {
          animation: bounce 1.5s infinite;
        }
        @keyframes fadeInFast {
          from { opacity: 0; transform: translateY(-6px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          40% { transform: translateY(-6px);}
          60% { transform: translateY(-3px);}
        }
      `}</style>
    </header>
  );
};

export default Navbar;
