'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  fetchCartItems,
  updateItemQuantity,
  removeItemFromCart,
  clearCartByStore,
} from '@/lib/redux/slice/cartSlice';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

export default function CartPage() {
  useAuthGuard();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { carts, status, loadingItemId } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // --- NEW: State untuk item yang dipilih checkout ---
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  // --- Helper select/unselect ---
  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedCartItemIds((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  // Pilih semua item dalam satu toko (cart)
  const handleSelectAllInStore = (cart: any) => {
    const allItemIds = cart.items.map((item: any) => item.id);
    const isAllSelected = allItemIds.every((id: number) => selectedCartItemIds.includes(id));
    if (isAllSelected) {
      setSelectedCartItemIds((prev) => prev.filter((id) => !allItemIds.includes(id)));
    } else {
      setSelectedCartItemIds((prev) => Array.from(new Set([...prev, ...allItemIds])));
    }
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity >= 1) dispatch(updateItemQuantity({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeItemFromCart(itemId));
    setSelectedCartItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleClearCart = (storeId: number) => {
    if (confirm('Are you sure you want to clear all items from this store?')) {
      dispatch(clearCartByStore(storeId));
      // Unselect semua item dari store ini juga
      const store = carts.find((c) => c.storeId === storeId);
      if (store) {
        const storeItemIds = store.items.map((item) => item.id);
        setSelectedCartItemIds((prev) => prev.filter((id) => !storeItemIds.includes(id)));
      }
    }
  };

  // --- NEW: Subtotal hanya untuk item terpilih ---
  const subtotal = useMemo(() => {
    let total = 0;
    carts.forEach((cart) => {
      cart.items.forEach((item) => {
        if (selectedCartItemIds.includes(item.id)) {
          total += item.product.basePrice * item.quantity;
        }
      });
    });
    return total;
  }, [carts, selectedCartItemIds]);

  if (status === 'loading') {
    return (
      <div className="py-20 text-center">
        <div className="h-12 w-12 animate-spin border-4 border-b-0 border-green-400 rounded-full mx-auto"></div>
        <p className="text-gray-700 mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (status === 'succeeded' && carts.every((c) => c.items.length === 0)) {
    return (
      <div className="py-24 text-center flex flex-col items-center">
        <ShoppingBagIcon className="w-24 h-24 text-green-100 drop-shadow mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8">
          Ayo mulai belanja kebutuhan sehari-hari!
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        >
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
          Shopping Cart
        </h1>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* CART ITEMS */}
          <section className="lg:w-2/3 space-y-10" aria-labelledby="cart-items">
            {carts
              .filter((cart) => cart.items.length > 0)
              .map((cart) => (
                <div
                  key={cart.id}
                  className="bg-white rounded-2xl shadow-lg border-l-4 border-transparent hover:border-green-500 transition overflow-hidden"
                >
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      {/* Bisa tambahkan logo toko di sini */}
                      <h3 className="font-bold text-gray-900 text-lg">
                        {cart.store.name}
                      </h3>
                      <span className="ml-2 text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                        Official Store
                      </span>
                      {/* Select All/Unselect All per store */}
                      <button
                        onClick={() => handleSelectAllInStore(cart)}
                        className="text-green-600 text-xs underline ml-4"
                      >
                        {cart.items.every((item) =>
                          selectedCartItemIds.includes(item.id)
                        )
                          ? 'Unselect All'
                          : 'Select All'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleClearCart(cart.storeId)}
                      className="flex items-center text-red-500 hover:text-red-700 bg-red-50 rounded-full px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Clear store"
                      tabIndex={0}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Clear Store
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-6 py-5 group"
                      >
                        {/* --- NEW: Checkbox select item --- */}
                        <input
                          type="checkbox"
                          className="mr-4 w-5 h-5 accent-green-600"
                          checked={selectedCartItemIds.includes(item.id)}
                          onChange={e => handleSelectItem(item.id, e.target.checked)}
                          aria-label={`Pilih ${item.product.name}`}
                        />
                        <img
                          src={
                            item.product.images[0]?.imageUrl ||
                            'https://placehold.co/80x80/e2e8f0/ffffff?text=No+Image'
                          }
                          alt={item.product.name}
                          className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="text-base lg:text-lg font-semibold text-gray-900 hover:underline hover:text-green-700 transition"
                          >
                            {item.product.name}
                          </Link>
                          <div className="mt-4 flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={loadingItemId === item.id}
                              aria-label="Kurangi quantity"
                              tabIndex={0}
                              className="w-9 h-9 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            >
                              {loadingItemId === item.id ? (
                                <div className="h-4 w-4 animate-spin border-b-2 border-gray-400 rounded-full" />
                              ) : (
                                <MinusIcon className="h-5 w-5" />
                              )}
                            </button>
                            <span className="text-lg font-bold w-10 text-center text-gray-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={loadingItemId === item.id}
                              aria-label="Tambah quantity"
                              tabIndex={0}
                              className="w-9 h-9 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            >
                              {loadingItemId === item.id ? (
                                <div className="h-4 w-4 animate-spin border-b-2 border-gray-400 rounded-full" />
                              ) : (
                                <PlusIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 min-w-fit">
                          <p className="text-lg font-bold text-green-700">
                            {formatRupiah(item.product.basePrice)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Total:{" "}
                            <span className="font-bold text-gray-900">
                              {formatRupiah(item.product.basePrice * item.quantity)}
                            </span>
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-2 p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                            aria-label="Hapus item"
                            tabIndex={0}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <Link
              href="/"
              className="inline-flex items-center text-green-700 hover:underline font-medium text-base mt-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" /> Back to Shopping
            </Link>
          </section>

          {/* ORDER SUMMARY */}
          <aside
            className="lg:w-1/3 bg-white rounded-2xl p-8 border border-gray-100 shadow-xl sticky top-8 self-start"
            aria-labelledby="order-summary"
          >
            <h2 id="order-summary" className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <dl className="space-y-4 text-base">
              <div className="flex justify-between">
                <dt className="text-gray-700">Subtotal</dt>
                <dd className="font-semibold text-gray-900">{formatRupiah(subtotal)}</dd>
              </div>
              {/* Garis separator tebal */}
              <div className="border-t-2 border-green-200 pt-5 flex justify-between items-center">
                <dt className="text-2xl font-extrabold text-green-700 tracking-tight">Total</dt>
                <dd>
                  <span className="inline-block bg-green-50 text-green-800 px-4 py-2 rounded-xl font-extrabold text-2xl tracking-wide shadow-sm">
                    {formatRupiah(subtotal)}
                  </span>
                </dd>
              </div>
            </dl>
            <button
              onClick={() => {
                // Simpan ID item terpilih ke localStorage lalu redirect ke /checkout
                localStorage.setItem(
                  'selectedCartItemIds',
                  JSON.stringify(selectedCartItemIds)
                );
                router.push('/checkout');
              }}
              className="mt-8 w-full bg-green-600 text-white py-4 rounded-full text-lg font-bold shadow-md hover:bg-green-700 active:scale-98 transition focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              tabIndex={0}
              aria-label="Proceed to checkout"
              disabled={selectedCartItemIds.length === 0}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
