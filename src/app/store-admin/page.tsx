'use client';

import React, { useEffect, type FC, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { fetchProfile } from '@/lib/redux/slice/profileSlice';
import { ShoppingCart, Archive, BarChart3, ArrowRight } from 'lucide-react';

// --- Komponen Kecil untuk Kartu Ringkasan ---
interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: 'green' | 'yellow' | 'blue';
}

const SummaryCard: FC<SummaryCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        blue: 'bg-blue-100 text-blue-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold text-gray-600">{title}</h3>
                <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-4">{value}</p>
            <div className="flex items-center text-sm text-gray-400 mt-2 group-hover:text-green-600 transition-colors">
                <span>Lihat Detail</span>
                <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
        </div>
    );
};


// --- Komponen Utama Halaman Dasbor ---
export default function StoreAdminDashboardPage() {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useAppDispatch();

    // --- Pengecekan Otentikasi & Otorisasi ---
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        // Jika tidak ada token, langsung redirect ke login
        if (!localToken) {
            // Anda bisa menggunakan toast di sini
            console.error("Redirecting: No token found.");
            router.push('/login');
            return;
        }
        // Jika ada token tapi data user belum ada di Redux, ambil data profil
        if (localToken && !user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, router, user]);

    useEffect(() => {
        // Efek ini berjalan setelah data user ada di Redux
        if (isAuthenticated && user) {
            // Jika role tidak sesuai, redirect ke halaman utama
            if (user.role !== 'STORE_ADMIN' && user.role !== 'SUPER_ADMIN') {
                // Anda bisa menggunakan toast di sini
                console.error("Redirecting: Insufficient role.");
                router.push('/'); 
            }
        }
    }, [isAuthenticated, user, router]);

    // --- Tampilan Loading ---
    // Tampilkan ini saat data user sedang diambil atau sebelum redirect
    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <main className="space-y-8">
            {/* Header Halaman */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dasbor Admin Toko</h1>
                <p className="mt-1.5 text-gray-500">Selamat datang kembali, {user?.fullName || 'Admin'}!</p>
            </div>

            {/* Kartu Ringkasan Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard title="Pesanan Baru" value="12" icon={ShoppingCart} color="green" />
                <SummaryCard title="Stok Hampir Habis" value="5" icon={Archive} color="yellow" />
                <SummaryCard title="Pendapatan Hari Ini" value="Rp 1.2jt" icon={BarChart3} color="blue" />
            </div>

            {/* Komponen Aktivitas Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                            <ShoppingCart size={16} />
                        </span>
                        <span>Pesanan baru #12345 telah dibuat.</span>
                        <span className="ml-auto text-xs text-gray-400">5 menit lalu</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                         <span className="bg-green-100 text-green-600 p-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </span>
                        <span>Pembayaran untuk pesanan #12344 telah dikonfirmasi.</span>
                        <span className="ml-auto text-xs text-gray-400">1 jam lalu</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <span className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full">
                            <Archive size={16} />
                        </span>
                        <span>Stok untuk "Organic Avocado" hampir habis.</span>
                        <span className="ml-auto text-xs text-gray-400">3 jam lalu</span>
                    </li>
                </ul>
            </div>
        </main>
    );
}
