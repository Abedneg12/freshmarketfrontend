'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard,
    ShoppingCart, 
    Archive, 
    TicketPercent, 
    BarChart3, 
    Book
} from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks'; // 1. Impor hook Redux

// --- Daftar Menu ---
const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/store-admin', icon: LayoutDashboard }, 
    { id: 'orders', label: 'Pesanan', href: '/store-admin/pesanan', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventaris', href: '/store-admin/inventaris', icon: Archive },
    { id: 'discounts', label: 'Diskon', href: '/store-admin/diskon', icon: TicketPercent },
    { id: 'reports', label: 'Laporan', href: '/store-admin/reports', icon: BarChart3 },
    { id: 'catalog', label: 'Katalog', href: '/store-admin/katalog', icon: Book },
];

// --- Komponen Sidebar ---
export default function AdminSidebar() {
    const pathname = usePathname();
    // 2. Ambil data profil dari profileSlice
    const userProfile  = useAppSelector((state) => state.profile);

    return (
        <div className="flex flex-col h-full bg-white text-gray-800 border-r border-gray-200/60">
            {/* Header Sidebar */}
            <Link href="/store-admin" className="p-5 flex items-center gap-3 border-b border-gray-200/60 h-[68px] hover:bg-gray-50 transition-colors">
                <div className="bg-gray-800 p-2.5 rounded-lg">
                    <ShoppingCart size={20} className="text-white"/>
                </div>
                <h1 className="text-xl font-bold text-gray-800">FreshMart</h1>
            </Link>

            {/* Menu Navigasi */}
            <nav className="flex-1 px-4 py-4 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                isActive
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 mr-3 transition-colors duration-200 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {isActive && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Sidebar (Sekarang Dinamis dan Dapat Diklik) */}
            <div className="p-4 border-t border-gray-200/60">
                 <Link href="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                     {/* 3. Gunakan data profil dinamis dengan fallback */}
                     <img 
                        src={userProfile?.profilePicture || "https://i.pravatar.cc/40?u=admin"} 
                        alt={userProfile?.fullName || "Admin"} 
                        className="w-10 h-10 rounded-full object-cover" 
                     />
                     <div>
                        <p className="text-sm font-semibold text-gray-800 truncate">{userProfile?.fullName || "Admin Toko"}</p>
                        <p className="text-xs text-gray-500 truncate">{userProfile?.email || "Memuat data..."}</p>
                     </div>
                </Link>
            </div>
        </div>
    );
};
