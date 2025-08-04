'use client';

import React, { useState, type FC, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAdminProducts } from '@/lib/redux/slice/storeadminproductSlice';
import { useAuthGuard } from '@/middlewares/useAuthGuard';

// --- Tipe Data dari Slice ---
interface IAdminProduct {
    id: number;
    name: string;
    category: { name: string };
    basePrice: number;
    images: { imageUrl: string }[];
    stocks: { quantity: number }[]; // Menampilkan jumlah stok
}

// --- Komponen Pagination ---
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

// --- Komponen Utama Halaman Katalog ---
export default function AdminCatalogPage() {
    useAuthGuard({ requiredRole: "STORE_ADMIN", redirectTo: "/login" });
    const dispatch = useAppDispatch();
    // Mengambil data dari state 'adminProducts' yang benar
    const { products, pagination, loading, error } = useAppSelector((state) => state.adminProducts);

    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    // TODO: Ambil daftar kategori dari API agar dinamis
    const uniqueCategories = ['all', 'Buah & Sayur', 'Roti & Kue', 'Daging & Ikan'];

    // useEffect untuk mengambil data saat filter atau halaman berubah
    useEffect(() => {
        const filters: { page: number; category?: string; search?: string } = { page: currentPage };
        if (categoryFilter !== 'all') {
            // Asumsi value dari filter adalah ID kategori
            filters.category = categoryFilter;
        }
        if (searchTerm) {
            filters.search = searchTerm;
        }
        dispatch(fetchAdminProducts(filters));
    }, [dispatch, currentPage, categoryFilter, searchTerm]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="space-y-8">
            {/* Header Halaman */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Katalog Produk</h1>
                <p className="mt-1.5 text-gray-500">Lihat semua produk yang relevan dengan toko Anda.</p>
            </div>

            {/* Kontrol Filter dan Pencarian */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                </div>
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none w-full md:w-56 pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'all' ? 'Semua Kategori' : cat}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Tabel Daftar Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Produk</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Kategori</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Stok Anda</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Harga Dasar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-500">Memuat data produk...</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-red-500">
                                        <p>Terjadi kesalahan: {error}</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={product.images[0]?.imageUrl || 'https://placehold.co/48x48/e2e8f0/a0aec0?text=Img'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <span className="font-medium text-gray-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.category.name}</td>
                                    <td className="px-6 py-4 text-gray-800 font-semibold text-center">
                                        {product.stocks[0]?.quantity ?? 0}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium text-right">
                                        Rp {product.basePrice.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Tidak ada produk yang cocok dengan filter Anda.</p>
                    </div>
                )}
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
