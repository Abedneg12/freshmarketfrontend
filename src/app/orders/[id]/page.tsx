'use client';

import React, { useEffect, useState, type FC, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    fetchOrderById,
    uploadPaymentProof,
    cancelOrderByUser,
    confirmOrderReceived
} from '@/lib/redux/slice/orderSlice';
import {
    ChevronLeft,
    FileUp,
    XCircle,
    CheckCircle2,
    Truck,
    Clock,
    CircleDollarSign,
    AlertCircle,
    MapPin
} from 'lucide-react';

type OrderStatus =
    | 'PROCESSED'
    | 'SHIPPED'
    | 'CONFIRMED'
    | 'CANCELED'
    | 'WAITING_FOR_PAYMENT'
    | 'WAITING_CONFIRMATION';

const statusInfo = {
    PROCESSED: { text: 'Diproses', style: 'bg-blue-200 text-blue-800', icon: <CheckCircle2 size={16} /> },
    SHIPPED: { text: 'Dikirim', style: 'bg-purple-200 text-purple-800', icon: <Truck size={16} /> },
    CONFIRMED: { text: 'Selesai', style: 'bg-green-200 text-green-800', icon: <CheckCircle2 size={16} /> },
    CANCELED: { text: 'Dibatalkan', style: 'bg-red-200 text-red-800', icon: <XCircle size={16} /> },
    WAITING_CONFIRMATION: { text: 'Menunggu Konfirmasi', style: 'bg-yellow-200 text-yellow-800', icon: <Clock size={16} /> },
    WAITING_FOR_PAYMENT: { text: 'Menunggu Pembayaran', style: 'bg-orange-200 text-orange-800', icon: <CircleDollarSign size={16} /> },
};

const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
    const info = statusInfo[status] || { text: 'Tidak Diketahui', style: 'bg-gray-200 text-gray-700', icon: <AlertCircle size={16} /> };
    return (
        <span className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-medium shadow-sm ${info.style}`}>
            {info.icon}
            <span>{info.text}</span>
        </span>
    );
};

export default function OrderDetailPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id ? Number(params.id) : null;

    // --- Ambil auth state dari Redux
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const { currentOrder, status, error } = useAppSelector((state) => state.order);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Order hanya di-fetch jika sudah login!
    useEffect(() => {
        if (!orderId) return;
        if (isAuthenticated && user) {
            dispatch(fetchOrderById(orderId));
        }
    }, [dispatch, orderId, isAuthenticated, user]);

    // --- Jika belum login (auth state belum ready): render skeleton
    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <div className="text-gray-400">Memeriksa autentikasi...</div>
            </div>
        );
    }

    // --- Loading order detail
    if (status === 'loading' && !currentOrder) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // --- Jika error (401/403), redirect ke login (opsional)
    if (error && error.toString().includes('401')) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    // --- Jika order tidak ditemukan/error lain
    if (error || !currentOrder) {
        return (
            <div className="text-center py-12 text-red-500">
                <p>Terjadi kesalahan: {error || "Pesanan tidak ditemukan."}</p>
                <Link href="/order-history" className="mt-4 inline-block text-green-600 hover:underline">Kembali ke Riwayat Pesanan</Link>
            </div>
        );
    }

    // --- Normal render setelah user ready dan order detail ada
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadProof = () => {
        if (selectedFile && orderId) {
            dispatch(uploadPaymentProof({ orderId, proofFile: selectedFile }));
        }
    };

    const handleCancelOrder = () => {
        if (orderId && confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
            dispatch(cancelOrderByUser(orderId));
        }
    };

    const handleConfirmReception = () => {
        if (orderId && confirm('Apakah Anda yakin pesanan telah diterima? Aksi ini tidak dapat dibatalkan.')) {
            dispatch(confirmOrderReceived(orderId));
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/order-history" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ChevronLeft size={20} />
                    <span>Kembali ke Riwayat Pesanan</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Detail Pesanan <span className="text-green-600">#{currentOrder.id}</span></h1>
                        <p className="mt-2 text-gray-500">
                            Dibuat pada {new Date(currentOrder.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <StatusBadge status={currentOrder.status as OrderStatus} />
                </div>

                {/* Tombol Aksi */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 mb-8 shadow flex flex-col gap-3">
                    {currentOrder.status === 'WAITING_FOR_PAYMENT' && (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/jpg" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 font-medium">
                                <FileUp size={16} />
                                <span>{selectedFile ? selectedFile.name : 'Pilih Bukti Bayar'}</span>
                            </button>
                            <button onClick={handleUploadProof} disabled={!selectedFile || status === 'loading'} className="w-full sm:w-auto flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition">
                                {status === 'loading' ? 'Mengunggah...' : 'Unggah Bukti Pembayaran'}
                            </button>
                            <button onClick={handleCancelOrder} className="w-full sm:w-auto flex-1 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 font-semibold transition">
                                Batalkan Pesanan
                            </button>
                        </div>
                    )}
                    {currentOrder.status === 'SHIPPED' && (
                        <div className="text-center">
                            <button onClick={handleConfirmReception} disabled={status === 'loading'} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold shadow transition">
                                {status === 'loading' ? 'Memproses...' : 'Konfirmasi Pesanan Diterima'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Produk */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <div className="flex items-center mb-6">
                            <span className="text-xl font-semibold text-gray-900">Ringkasan Produk</span>
                            <div className="flex-grow border-t border-gray-100 ml-4" />
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {currentOrder.items?.map((item: any, index: number) => (
                                <li key={index} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={item.product.images?.[0]?.imageUrl || 'https://placehold.co/64x64/e2e8f0/a0aec0?text=Img'} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm" />
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x <span className="font-semibold text-gray-700">Rp {item.price.toLocaleString('id-ID')}</span></p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-600 text-lg">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ringkasan & Alamat */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow border border-green-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">Total Pembayaran</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">Rp {currentOrder.totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-green-700">Rp {currentOrder.totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-green-600" /> Alamat Pengiriman</h2>
                            {currentOrder.address ? (
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-bold text-gray-900">{currentOrder.address.label}</p>
                                    <p>{currentOrder.address.recipient}, {currentOrder.address.phone}</p>
                                    <p>{currentOrder.address.addressLine}</p>
                                    <p>{currentOrder.address.city}, {currentOrder.address.province} {currentOrder.address.postalCode}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Alamat tidak tersedia.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
