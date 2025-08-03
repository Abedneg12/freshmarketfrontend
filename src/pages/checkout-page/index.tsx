'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCartItems } from '@/lib/redux/slice/cartSlice';
import { fetchAddresses } from '@/lib/redux/slice/addressSlice';
import { createOrder, resetOrderStatus } from '@/lib/redux/slice/orderSlice';
import { CreditCardIcon, TruckIcon, XCircleIcon, CheckCircle2Icon } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // State lokal
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'MIDTRANS'>('BANK_TRANSFER');

    // Voucher
    const [voucherInput, setVoucherInput] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherInfo, setVoucherInfo] = useState<{ ok: boolean; msg: string }>({ ok: false, msg: '' });

    // Ambil data dari Redux
    const { carts } = useAppSelector((state) => state.cart);
    const { addresses } = useAppSelector((state) => state.address);
    const { status: orderStatus, error: orderError } = useAppSelector((state) => state.order);

    // Fetch cart & address on mount
    useEffect(() => {
        dispatch(fetchCartItems());
        dispatch(fetchAddresses());
        dispatch(resetOrderStatus());
    }, [dispatch]);

    // Pilih alamat utama jika ada
    useEffect(() => {
        if (addresses && addresses.length > 0) {
            const mainAddress = addresses.find(addr => addr.isMain);
            setSelectedAddressId(mainAddress ? mainAddress.id : addresses[0].id);
        }
    }, [addresses]);

    // Subtotal dari seluruh item
    const subtotal = useMemo(() => {
        return carts.reduce((total, cart) =>
            total + cart.items.reduce((itemSum, item) => itemSum + (item.product.basePrice * item.quantity), 0), 0);
    }, [carts]);

    // Ongkir flat
    const shipping = 5000;

    // Handler apply voucher (optional, hanya update di UI, backend tetap re-cek)
    const handleApplyVoucher = () => {
        if (!voucherInput) {
            setVoucherInfo({ ok: false, msg: 'Masukkan kode voucher.' });
            return;
        }
        setVoucherCode(voucherInput.trim());
        setVoucherInfo({ ok: true, msg: `Voucher "${voucherInput.trim()}" diterapkan.` });
    };

    // Handler untuk hapus voucher
    const handleRemoveVoucher = () => {
        setVoucherCode('');
        setVoucherInput('');
        setVoucherInfo({ ok: false, msg: '' });
    };

    // Place order
    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select a shipping address.");
            return;
        }
        const allCartItemIds = carts.flatMap(cart => cart.items.map(item => item.id));
        if (allCartItemIds.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Kirim order ke backend
        const resultAction = await dispatch(createOrder({
            addressId: selectedAddressId,
            paymentMethod,
            cartItemIds: allCartItemIds,
            voucherCode: voucherCode || undefined,
        }));

        if (createOrder.fulfilled.match(resultAction)) {
            const { midtransRedirectUrl, order } = resultAction.payload;
            // Optional: tampilkan info voucher berhasil/tidak dari backend di sini!
            if (midtransRedirectUrl) {
                window.location.href = midtransRedirectUrl;
            } else {
                router.push(`/pembayaran/${order.id}`);
            }
        } else {
            // Jika error voucher dari backend
            if ( resultAction.payload && typeof resultAction.payload === 'object' &&
            'error' in resultAction.payload &&
            typeof resultAction.payload.error === 'string' &&
            resultAction.payload.error.toLowerCase().includes("voucher")
            ) {
            setVoucherInfo({ ok: false, msg: resultAction.payload.error });
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bagian kiri: alamat & pembayaran */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Alamat */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
                            <div className="space-y-4">
                                {addresses?.map((addr: any) => (
                                    <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-800">{addr.label} {addr.isMain && <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full ml-2">Utama</span>}</p>
                                                <p className="text-sm text-gray-600">{addr.recipient}, {addr.phone}</p>
                                                <p className="text-sm text-gray-600">{addr.addressLine}, {addr.city}</p>
                                            </div>
                                            <div className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                                {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Metode pembayaran */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
                            <div className="space-y-4">
                                <div onClick={() => setPaymentMethod('BANK_TRANSFER')} className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center ${paymentMethod === 'BANK_TRANSFER' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}>
                                    <CreditCardIcon className="h-6 w-6 mr-4 text-gray-600"/>
                                    <div>
                                        <p className="font-bold text-gray-800">Bank Transfer</p>
                                        <p className="text-sm text-gray-500">Pay via manual bank transfer.</p>
                                    </div>
                                </div>
                                <div onClick={() => setPaymentMethod('MIDTRANS')} className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center ${paymentMethod === 'MIDTRANS' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}>
                                    <TruckIcon className="h-6 w-6 mr-4 text-gray-600"/>
                                    <div>
                                        <p className="font-bold text-gray-800">Payment Gateway</p>
                                        <p className="text-sm text-gray-500">Use credit card, e-wallet, and more via Midtrans.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                            {/* Voucher Input */}
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-700 block mb-1">Voucher Code</label>
                                {!voucherCode ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter voucher code"
                                            value={voucherInput}
                                            onChange={(e) => setVoucherInput(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyVoucher}
                                            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-700 text-xs flex items-center gap-1">
                                            <CheckCircle2Icon size={16} className="inline" /> Voucher: <b>{voucherCode}</b>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRemoveVoucher}
                                            className="ml-2 text-gray-400 hover:text-red-500"
                                            title="Hapus voucher"
                                        >
                                            <XCircleIcon size={18} />
                                        </button>
                                    </div>
                                )}
                                {voucherInfo.msg && (
                                    <p className={`text-xs mt-1 ${voucherInfo.ok ? 'text-green-600' : 'text-red-500'}`}>{voucherInfo.msg}</p>
                                )}
                            </div>
                            {/* Rangkuman item */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {carts.flatMap(cart => cart.items).map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 truncate pr-2">{item.product.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                        <span className="text-gray-800 whitespace-nowrap">Rp {(item.product.basePrice * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t my-4"></div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-800">Rp {shipping.toLocaleString('id-ID')}</span>
                                </div>
                                {/* Diskon voucher (jika ingin tampilkan estimasi, perlu preview dari backend) */}
                            </div>
                            <div className="border-t my-4"></div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total (approx.)</span>
                                <span>Rp {(subtotal + shipping).toLocaleString('id-ID')}</span>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={orderStatus === 'loading' || !selectedAddressId}
                                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {orderStatus === 'loading' ? 'Processing...' : 'Place Order'}
                            </button>
                            {orderError && <p className="text-red-500 text-sm mt-2 text-center">{orderError}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
