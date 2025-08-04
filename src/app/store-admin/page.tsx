'use client';

import React, { useEffect, type FC, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { fetchProfile } from '@/lib/redux/slice/profileSlice';
// 1. Impor thunk untuk mengambil aktivitas
import { fetchDashboardSummary, fetchRecentActivity } from '@/lib/redux/slice/storeadminDashboardSlice'; 
import { ShoppingCart, Archive, BarChart3, ArrowRight, CheckCircle2, Truck, XCircle } from 'lucide-react';
import withStoreAdminAuth from '@/components/common/StoreAdminAuth';

// --- Komponen SummaryCard (Tidak Berubah) ---
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

// --- [BARU] Komponen untuk menampilkan satu item aktivitas ---
const ActivityItem: FC<{ log: any }> = ({ log }) => {
    const statusInfo = {
        PROCESSED: { icon: CheckCircle2, color: 'blue', text: `Pembayaran untuk pesanan #${log.order.id} telah dikonfirmasi.` },
        SHIPPED: { icon: Truck, color: 'purple', text: `Pesanan #${log.order.id} telah dikirim.` },
        CANCELED: { icon: XCircle, color: 'red', text: `Pesanan #${log.order.id} dibatalkan.` },
        // Tambahkan status lain jika perlu
        default: { icon: ShoppingCart, color: 'gray', text: log.note || `Status pesanan #${log.order.id} diubah.` }
    };
    const info = statusInfo[log.newStatus as keyof typeof statusInfo] || statusInfo.default;
    const colorClasses = `bg-${info.color}-100 text-${info.color}-600`;

    return (
        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <span className={`${colorClasses} p-1.5 rounded-full`}>
                <info.icon size={16} />
            </span>
            <span>{info.text}</span>
            <span className="ml-auto text-xs text-gray-400">
                {new Date(log.changedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
        </li>
    );
};



function StoreAdminDashboardPage() {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    // 2. Ambil data aktivitas terbaru dari Redux store
    const { summary, recentActivity, loading: summaryLoading } = useAppSelector((state) => state.storeAdminDashboard);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            router.push('/login');
            return;
        }
        if (localToken && !user) {
            dispatch(fetchProfile());
        }
    }, [dispatch, router, user]);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user?.role !== 'STORE_ADMIN' && user?.role !== 'SUPER_ADMIN') {
                router.push('/'); 
            } else {
                // 3. Panggil API ringkasan dan aktivitas
                dispatch(fetchDashboardSummary());
                dispatch(fetchRecentActivity());
            }
        }
    }, [isAuthenticated, user, router, dispatch]);


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
                <SummaryCard title="Pesanan Baru" value={summaryLoading ? '...' : String(summary?.newOrders ?? 0)} icon={ShoppingCart} color="green" />
                <SummaryCard title="Pendapatan Hari Ini" value={summaryLoading ? '...' : `Rp ${(summary?.dailyRevenue ?? 0).toLocaleString('id-ID')}`} icon={BarChart3} color="blue" />
            </div>

            {/* Komponen Aktivitas Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                    {recentActivity.length > 0 ? (
                        recentActivity.map(log => <ActivityItem key={log.id} log={log} />)
                    ) : (
                        <p className="text-center text-gray-500 py-4">Tidak ada aktivitas terbaru.</p>
                    )}
                </ul>
            </div>
        </main>
    );
}

export default withStoreAdminAuth(StoreAdminDashboardPage);