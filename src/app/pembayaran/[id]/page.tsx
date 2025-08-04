'use client';

import React, { useState, useEffect, type FC } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, Copy, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchOrderById } from '@/lib/redux/slice/orderSlice';
import withAuth from '@/components/common/Auth';

// --- Komponen untuk satu Opsi Bank (Tidak Berubah) ---
interface BankOptionProps {
    name: string;
    accountNumber: string;
    accountName: string;
    logoUrl: string;
}

const BankOption: FC<BankOptionProps> = ({ name, accountNumber, accountName, logoUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
                <img src={logoUrl} alt={`${name} logo`} className="h-6 object-contain" />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{accountNumber}</p>
                    <p className="text-xs text-gray-500">a/n {accountName}</p>
                </div>
            </div>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
            >
                <Copy size={14} />
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
        </div>
    );
};


// --- Komponen Utama Halaman Instruksi Pembayaran ---
function PaymentInstructionPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();
    
    const orderId = params?.id ? Number(params.id) : null;
    
    // Ambil data pesanan dari Redux store
    const { currentOrder, status, error } = useAppSelector((state) => state.order);
    
    const [timeLeft, setTimeLeft] = useState('');

    // Ambil detail pesanan dari backend saat komponen dimuat
    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
        }
    }, [dispatch, orderId]);

    // Logika untuk countdown timer, sekarang menggunakan data asli
    useEffect(() => {
        if (!currentOrder) return;

        // Batas waktu 2 jam dari waktu pesanan dibuat
        const paymentDeadline = new Date(new Date(currentOrder.createdAt).getTime() + 2 * 60 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = paymentDeadline.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft("Waktu pembayaran telah habis.");
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${hours} jam ${minutes} menit ${seconds} detik`);
        }, 1000);

        return () => clearInterval(timer);
    }, [currentOrder]);

    // Tampilan saat loading
    if (status === 'loading') {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }
    
    // Tampilan jika ada error atau pesanan tidak ditemukan
    if (error || !currentOrder) {
        return (
             <div className="bg-gray-50 min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
                    <p className="text-gray-600 mt-2">{error || "Pesanan tidak dapat ditemukan."}</p>
                    <button onClick={() => router.push('/')} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">Kembali ke Beranda</button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 space-y-6">
                
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Selesaikan Pembayaran</h1>
                    <p className="text-gray-500 mt-1">Pesanan Anda <span className="font-semibold text-gray-700">#{currentOrder.id}</span> telah dibuat.</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3 text-center">
                    <p className="text-sm text-green-800">Total Pembayaran</p>
                    <p className="text-3xl font-bold text-green-700">
                        Rp {currentOrder.totalPrice.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-700 font-medium pt-2">
                        <Clock size={16} />
                        <span>Batas Waktu: {timeLeft}</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Transfer ke Rekening Berikut:</h2>
                    <div className="space-y-3">
                        <BankOption name="BCA" accountNumber="123 456 7890" accountName="PT FreshMart Indonesia" logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" />
                        <BankOption name="Mandiri" accountNumber="098 765 4321" accountName="PT FreshMart Indonesia" logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png" />
                        <BankOption name="BNI" accountNumber="112 233 4455" accountName="PT FreshMart Indonesia" logoUrl="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1280px-BNI_logo.svg.png" />
                    </div>
                </div>
                
                <div className="flex items-start gap-3 bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200">
                    <AlertTriangle size={24} className="flex-shrink-0" />
                    <p>Pastikan Anda mentransfer jumlah yang tepat. Pembayaran dengan jumlah yang tidak sesuai dapat menghambat proses verifikasi.</p>
                </div>

                <div className="space-y-3 pt-4">
                     <button
                        onClick={() => router.push(`/orders/${orderId}`)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Saya Sudah Bayar, Unggah Bukti
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full text-gray-600 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>

            </div>
        </div>
    );
}

export default withAuth(PaymentInstructionPage);