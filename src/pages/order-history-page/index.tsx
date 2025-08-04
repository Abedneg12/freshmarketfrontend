'use client';

import React, { useEffect, useState, type FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUserOrders } from '@/lib/redux/slice/orderSlice';
import { ChevronLeft, ChevronRight, ShoppingBagIcon, Filter, Search } from 'lucide-react';
import { useAuthGuard } from '@/middlewares/useAuthGuard';

// --- Tipe Data dari Slice ---
type OrderStatus =
    | 'PROCESSED'
    | 'SHIPPED'
    | 'CONFIRMED'
    | 'CANCELED'
    | 'WAITING_FOR_PAYMENT'
    | 'WAITING_CONFIRMATION';

// --- Komponen Badge Status ---
const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        PROCESSED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        CONFIRMED: 'bg-green-100 text-green-700',
        CANCELED: 'bg-red-100 text-red-700',
        WAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-700',
        WAITING_FOR_PAYMENT: 'bg-orange-100 text-orange-700',
    };
    const statusText = {
        PROCESSED: 'Diproses',
        SHIPPED: 'Dikirim',
        CONFIRMED: 'Selesai',
        CANCELED: 'Dibatalkan',
        WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
        WAITING_FOR_PAYMENT: 'Menunggu Pembayaran',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${statusStyles[status]?.replace('100', '400').replace('text-', 'bg-') || 'bg-gray-400'}`}></span>
            {statusText[status] || 'Tidak Diketahui'}
        </span>
    );
};

// --- Komponen Pagination ---
const Pagination: FC<{ pagination: any, onPageChange: (page: number) => void }> = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-end gap-2 px-6 py-4">
            <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
            </button>
            <span className="text-sm text-gray-700">
                Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span>Berikutnya</span>
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

// --- Komponen Utama Halaman Riwayat Pesanan ---
export default function OrderHistoryPage() {
    useAuthGuard();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { orders, pagination, status, error } = useAppSelector((state) => state.order);

    // State untuk filter dan pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchId, setSearchId] = useState('');
    const [searchIdApplied, setSearchIdApplied] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    useEffect(() => {
        // Gabungkan semua parameter filter untuk dikirim ke backend
        const filters: any = {
            page: currentPage,
            status: statusFilter === 'all' ? undefined : statusFilter,
        };
        if (searchIdApplied) filters.orderId = Number(searchIdApplied); // Pastikan dikirim sebagai number
        if (dateStart) filters.startDate = dateStart;
        if (dateEnd) filters.endDate = dateEnd;
        dispatch(fetchUserOrders(filters));
    }, [dispatch, currentPage, statusFilter, searchIdApplied, dateStart, dateEnd]);

    const handlePageChange = (newPage: number) => setCurrentPage(newPage);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchIdApplied(searchId.trim());
        setCurrentPage(1);
    };

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Memuat riwayat pesanan...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center py-12 text-red-500">
                    <p>Terjadi kesalahan: {error}</p>
                </div>
            );
        }
        if (orders.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="mb-6 flex justify-center">
                        <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Anda Belum Memiliki Pesanan
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Semua pesanan yang Anda buat akan muncul di sini.
                    </p>
                    <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                        Mulai Belanja
                    </Link>
                </div>
            );
        }
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">ID Pesanan</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} onClick={() => router.push(`/orders/${order.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-green-600 whitespace-nowrap">{`#FM-${order.id}`}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium text-right whitespace-nowrap">
                                        Rp {order.totalPrice.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={order.status as OrderStatus} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
        );
    };

    return (
        <div className="w-full bg-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4 md:mb-0">Riwayat Pesanan Saya</h1>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto bg-slate-100 rounded-xl px-4 py-4 shadow">
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-56">
                            <input
                                type="number"
                                min="1"
                                inputMode="numeric"
                                placeholder="Cari ID Pesanan"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                                tabIndex={-1}
                            >
                                <Search size={18} />
                            </button>
                        </form>
                        {/* Date Range */}
                        <input
                            type="date"
                            className="w-full md:w-40 pl-4 pr-2 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            value={dateStart}
                            max={dateEnd || undefined}
                            onChange={(e) => {
                                setDateStart(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <span className="hidden md:inline-block text-gray-500 px-1">-</span>
                        <input
                            type="date"
                            className="w-full md:w-40 pl-4 pr-2 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            value={dateEnd}
                            min={dateStart || undefined}
                            onChange={(e) => {
                                setDateEnd(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        {/* Status Filter */}
                        <div className="relative w-full md:w-56">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="appearance-none w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            >
                                <option value="all">Semua Status</option>
                                <option value="WAITING_FOR_PAYMENT">Menunggu Pembayaran</option>
                                <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
                                <option value="PROCESSED">Diproses</option>
                                <option value="SHIPPED">Dikirim</option>
                                <option value="CONFIRMED">Selesai</option>
                                <option value="CANCELED">Dibatalkan</option>
                            </select>
                            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}
