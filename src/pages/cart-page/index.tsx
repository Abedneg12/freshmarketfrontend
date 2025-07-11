'use client';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowLeftIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
    fetchCartItems, 
    updateItemQuantity, 
    removeItemFromCart,
    clearCartByStore
} from '@/lib/redux/slice/cartSlice';

const CartPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Ambil state keranjang dari Redux store
    const { carts, status, error } = useAppSelector((state) => state.cart);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    // Ambil data keranjang dari backend saat komponen pertama kali dimuat
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, isAuthenticated]);

    // Handler untuk aksi-aksi di keranjang
    const handleUpdateQuantity = (itemId: number, quantity: number) => {
        if (quantity >= 1) {
            dispatch(updateItemQuantity({ itemId, quantity }));
        }
    };

    const handleRemoveItem = (itemId: number) => {
        dispatch(removeItemFromCart(itemId));
    };

    const handleClearCart = (storeId: number) => {
        if (confirm('Are you sure you want to clear all items from this store?')) {
            dispatch(clearCartByStore(storeId));
        }
    };

    // Kalkulasi total harga menggunakan useMemo agar efisien
    const subtotal = useMemo(() => {
        return carts.reduce((total, cart) => 
            total + cart.items.reduce((itemSum, item) => itemSum + (item.product.basePrice * item.quantity), 0), 0);
    }, [carts]);

    // Tampilan saat loading
    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your cart...</p>
            </div>
        );
    }
    
    // Tampilan jika keranjang kosong
    if (status === 'succeeded' && carts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mb-6 flex justify-center">
                    <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                    Looks like you haven't added any items to your cart yet.
                </p>
                <Link href="/catalog" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Daftar Item Keranjang */}
                    <div className="lg:w-2/3 space-y-6">
                        {carts.map(cart => (
                            <div key={cart.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">
                                        Items from: {cart.store.name}
                                    </h2>
                                    <button 
                                        onClick={() => handleClearCart(cart.storeId)}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center"
                                    >
                                        <TrashIcon className="h-3 w-3 mr-1" /> Clear Cart
                                    </button>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-gray-700 text-left sr-only sm:not-sr-only">
                                        <tr>
                                            <th className="py-4 px-6">Product</th>
                                            <th className="py-4 px-6">Quantity</th>
                                            <th className="py-4 px-6 text-right">Price</th>
                                            <th className="py-4 px-6 text-right">Total</th>
                                            <th className="py-4 px-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {cart.items.map(item => (
                                            <tr key={item.id}>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <img src={item.product.images[0]?.imageUrl || 'https://placehold.co/64x64/e2e8f0/a0aec0?text=Img'} alt={item.product.name} className="h-16 w-16 rounded object-cover mr-4" />
                                                        <div>
                                                            <Link href={`/product/${item.product.id}`} className="font-medium text-gray-900 hover:text-green-600">
                                                                {item.product.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center border border-gray-300 rounded-md w-24">
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                                                            <MinusIcon className="h-4 w-4" />
                                                        </button>
                                                        <span className="px-2 py-1 text-gray-800 font-medium flex-grow text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                                                            <PlusIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right text-black">
                                                    Rp {item.product.basePrice.toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-4 px-6 text-right font-medium text-black">
                                                    Rp {(item.product.basePrice * item.quantity).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        <div className="mt-6">
                            <Link href="/" className="flex items-center text-gray-700 hover:text-green-600 font-medium">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                    {/* Ringkasan Pesanan */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {/* Tambahkan kalkulasi ongkir dan pajak di halaman checkout */}
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => router.push('/checkout')} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
