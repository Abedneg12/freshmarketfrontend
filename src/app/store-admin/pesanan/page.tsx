'use client';

import React, { useState, useMemo, type FC } from 'react';
import { Search, ChevronDown, Eye, Filter } from 'lucide-react';

// --- Tipe Data Dummy ---
type OrderStatus = 'PROCESSED' | 'SHIPPED' | 'CONFIRMED' | 'CANCELED' | 'WAITING_CONFIRMATION';

interface DummyOrder {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: OrderStatus;
}

// --- Data Dummy untuk Pesanan ---
const dummyOrders: DummyOrder[] = [
    { id: 'FM-12345', customerName: 'Budi Santoso', date: '2025-07-10', total: 250000, status: 'PROCESSED' },
    { id: 'FM-12344', customerName: 'Citra Lestari', date: '2025-07-10', total: 150000, status: 'SHIPPED' },
    { id: 'FM-12343', customerName: 'Ahmad Yani', date: '2025-07-09', total: 75000, status: 'WAITING_CONFIRMATION' },
    { id: 'FM-12342', customerName: 'Dewi Anggraini', date: '2025-07-09', total: 550000, status: 'CONFIRMED' },
    { id: 'FM-12341', customerName: 'Eko Prasetyo', date: '2025-07-08', total: 85000, status: 'CANCELED' },
    { id: 'FM-12340', customerName: 'Fitriana', date: '2025-07-08', total: 120000, status: 'CONFIRMED' },
];

// --- Komponen Badge Status ---
const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        PROCESSED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        CONFIRMED: 'bg-green-100 text-green-700',
        CANCELED: 'bg-red-100 text-red-700',
        WAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-700',
    };
    const statusText = {
        PROCESSED: 'Diproses',
        SHIPPED: 'Dikirim',
        CONFIRMED: 'Selesai',
        CANCELED: 'Dibatalkan',
        WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
    }

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusStyles[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${statusStyles[status].replace('100', '400').replace('text-','bg-')}`}></span>
            {statusText[status]}
        </span>
    );
};


// --- Komponen Utama Halaman Pesanan ---
export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = useMemo(() => {
        return dummyOrders
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, statusFilter]);

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
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-x-auto">
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
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{order.id}</td>
                                <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                                <td className="px-6 py-4 text-gray-800 font-medium text-right">
                                    Rp {order.total.toLocaleString('id-ID')}
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
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Tidak ada pesanan yang cocok dengan filter Anda.</p>
                    </div>
                )}
            </div>
            {/* Di sini bisa ditambahkan komponen Pagination */}
        </div>
    );
}
