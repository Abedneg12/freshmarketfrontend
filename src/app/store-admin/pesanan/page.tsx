'use client';

import React, { useState, useMemo, type FC, useEffect } from 'react';
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAdminOrders } from '@/lib/redux/slice/adminorderslice';

// --- Tipe Data dari Slice ---
type OrderStatus = 'PROCESSED' | 'SHIPPED' | 'CONFIRMED' | 'CANCELED' | 'WAITING_CONFIRMATION' | 'WAITING_FOR_PAYMENT';

// --- Komponen Badge Status (Tidak Berubah) ---
const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        PROCESSED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        CONFIRMED: 'bg-green-100 text-green-700',
        CANCELED: 'bg-red-100 text-red-700',
        WAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-700',
        WAITING_FOR_PAYMENT: 'bg-gray-100 text-gray-700',
    };
    const statusText = {
        PROCESSED: 'Diproses',
        SHIPPED: 'Dikirim',
        CONFIRMED: 'Selesai',
        CANCELED: 'Dibatalkan',
        WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
        WAITING_FOR_PAYMENT: 'Menunggu Pembayaran',
    }

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusStyles[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${statusStyles[status].replace('100', '400').replace('text-','bg-')}`}></span>
            {statusText[status]}
        </span>
    );
};

// --- Komponen Pagination (Sekarang menggunakan data dari Redux) ---
const Pagination: FC<{ pagination: any, onPageChange: (page: number) => void }> = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200/80">
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


// --- Komponen Utama Halaman Pesanan ---
export default function AdminOrdersPage() {
    const dispatch = useAppDispatch();
    const { orders, pagination, loading, error } = useAppSelector((state) => state.adminorders);
    
    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // useEffect untuk mengambil data saat filter atau halaman berubah
    useEffect(() => {
        const filters: { page: number; status?: string; search?: string } = { page: currentPage };
        if (statusFilter !== 'all') {
            filters.status = statusFilter;
        }
        if (searchTerm) {
            filters.search = searchTerm;
        }
        dispatch(fetchAdminOrders(filters));
    }, [dispatch, currentPage, statusFilter, searchTerm]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="space-y-8">
            {/* Header Halaman */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manajemen Pesanan</h1>
                <p className="mt-1.5 text-gray-500">Lihat, kelola, dan proses semua pesanan yang masuk ke toko Anda.</p>
            </div>

            {/* Kontrol Filter dan Pencarian */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan ID Pesanan atau Nama Pelanggan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                </div>
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    >
                        <option value="all">Semua Status</option>
                        <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
                        <option value="PROCESSED">Diproses</option>
                        <option value="SHIPPED">Dikirim</option>
                        <option value="CONFIRMED">Selesai</option>
                        <option value="CANCELED">Dibatalkan</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Tabel Daftar Pesanan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">ID Pesanan</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Pelanggan</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-500">Memuat data pesanan...</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-red-500">
                                        <p>Terjadi kesalahan: {error}</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && orders.length > 0 && orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{`FM-${order.id}`}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.user.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium text-right whitespace-nowrap">
                                        Rp {order.totalPrice.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Tidak ada pesanan yang cocok dengan filter Anda.</p>
                    </div>
                )}
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
