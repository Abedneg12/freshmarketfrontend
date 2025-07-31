// // 'use client';
// // import React, { useEffect, useMemo } from 'react';
// // import Link from 'next/link';
// // import { useRouter } from 'next/navigation';
// // import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowLeftIcon } from 'lucide-react';
// // import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// // import { 
// //     fetchCartItems, 
// //     updateItemQuantity, 
// //     removeItemFromCart,
// //     clearCartByStore
// // } from '@/lib/redux/slice/cartSlice';

// // // Menggunakan 'export default function' sesuai standar Next.js App Router
// // export default function CartPage() {
// //     const router = useRouter();
// //     const dispatch = useAppDispatch();

// //     // Ambil state keranjang dari Redux store
// //     const { carts, status, error } = useAppSelector((state) => state.cart);
// //     const { isAuthenticated } = useAppSelector((state) => state.auth);

// //     // Ambil data keranjang dari backend saat komponen pertama kali dimuat
// //     useEffect(() => {
// //         if (isAuthenticated) {
// //             dispatch(fetchCartItems());
// //         }
// //     }, [dispatch, isAuthenticated]);

// //     // Handler untuk aksi-aksi di keranjang
// //     const handleUpdateQuantity = (itemId: number, quantity: number) => {
// //         if (quantity >= 1) {
// //             dispatch(updateItemQuantity({ itemId, quantity }));
// //         }
// //     };

// //     const handleRemoveItem = (itemId: number) => {
// //         dispatch(removeItemFromCart(itemId));
// //     };

// //     const handleClearCart = (storeId: number) => {
// //         if (confirm('Are you sure you want to clear all items from this store?')) {
// //             dispatch(clearCartByStore(storeId));
// //         }
// //     };

// //     // Kalkulasi total harga menggunakan useMemo agar efisien
// //     const subtotal = useMemo(() => {
// //         return carts.reduce((total, cart) => 
// //             total + cart.items.reduce((itemSum, item) => itemSum + (item.product.basePrice * item.quantity), 0), 0);
// //     }, [carts]);

// //     // Tampilan saat loading
// //     if (status === 'loading') {
// //         return (
// //             <div className="container mx-auto px-4 py-16 text-center">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
// //                 <p className="mt-4 text-gray-600">Loading your cart...</p>
// //             </div>
// //         );
// //     }
    
// //     // Tampilan jika keranjang kosong
// //     if (status === 'succeeded' && carts.length === 0) {
// //         return (
// //             <div className="container mx-auto px-4 py-16 text-center">
// //                 <div className="mb-6 flex justify-center">
// //                     <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
// //                 </div>
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
// //                     Your cart is empty
// //                 </h2>
// //                 <p className="text-gray-600 mb-6">
// //                     Looks like you haven't added any items to your cart yet.
// //                 </p>
// //                 <Link href="/catalog" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
// //                     Continue Shopping
// //                 </Link>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="bg-white">
// //             <div className="container mx-auto px-4 py-8">
// //                 <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
// //                 <div className="flex flex-col lg:flex-row gap-8">
// //                     {/* Daftar Item Keranjang */}
// //                     <div className="lg:w-2/3 space-y-6">
// //                         {carts.map(cart => (
// //                             <div key={cart.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //                                 <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
// //                                     <h2 className="font-semibold text-gray-800">
// //                                         Items from: {cart.store.name}
// //                                     </h2>
// //                                     <button 
// //                                         onClick={() => handleClearCart(cart.storeId)}
// //                                         className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center"
// //                                     >
// //                                         <TrashIcon className="h-3 w-3 mr-1" /> Clear Cart
// //                                     </button>
// //                                 </div>
// //                                 <table className="w-full">
// //                                     <thead className="bg-gray-50 text-gray-700 text-left sr-only sm:not-sr-only">
// //                                         <tr>
// //                                             <th className="py-4 px-6">Product</th>
// //                                             <th className="py-4 px-6">Quantity</th>
// //                                             <th className="py-4 px-6 text-right">Price</th>
// //                                             <th className="py-4 px-6 text-right">Total</th>
// //                                             <th className="py-4 px-6"></th>
// //                                         </tr>
// //                                     </thead>
// //                                     <tbody className="divide-y divide-gray-200">
// //                                         {cart.items.map(item => (
// //                                             <tr key={item.id}>
// //                                                 <td className="py-4 px-6">
// //                                                     <div className="flex items-center">
// //                                                         <img src={item.product.images[0]?.imageUrl || 'https://placehold.co/64x64/e2e8f0/a0aec0?text=Img'} alt={item.product.name} className="h-16 w-16 rounded object-cover mr-4" />
// //                                                         <div>
// //                                                             <Link href={`/product/${item.product.id}`} className="font-medium text-gray-900 hover:text-green-600">
// //                                                                 {item.product.name}
// //                                                             </Link>
// //                                                         </div>
// //                                                     </div>
// //                                                 </td>
// //                                                 <td className="py-4 px-6">
// //                                                     <div className="flex items-center border border-gray-300 rounded-md w-24">
// //                                                         <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// //                                                             <MinusIcon className="h-4 w-4" />
// //                                                         </button>
// //                                                         <span className="px-2 py-1 text-gray-800 font-medium flex-grow text-center">
// //                                                             {item.quantity}
// //                                                         </span>
// //                                                         <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// //                                                             <PlusIcon className="h-4 w-4" />
// //                                                         </button>
// //                                                     </div>
// //                                                 </td>
// //                                                 <td className="py-4 px-6 text-right text-black">
// //                                                     Rp {item.product.basePrice.toLocaleString('id-ID')}
// //                                                 </td>
// //                                                 <td className="py-4 px-6 text-right font-medium text-black">
// //                                                     Rp {(item.product.basePrice * item.quantity).toLocaleString('id-ID')}
// //                                                 </td>
// //                                                 <td className="py-4 px-6 text-right">
// //                                                     <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
// //                                                         <TrashIcon className="h-5 w-5" />
// //                                                     </button>
// //                                                 </td>
// //                                             </tr>
// //                                         ))}
// //                                     </tbody>
// //                                 </table>
// //                             </div>
// //                         ))}
// //                         <div className="mt-6">
// //                             <Link href="/" className="flex items-center text-gray-700 hover:text-green-600 font-medium">
// //                                 <ArrowLeftIcon className="h-4 w-4 mr-2" />
// //                                 Continue Shopping
// //                             </Link>
// //                         </div>
// //                     </div>
// //                     {/* Ringkasan Pesanan */}
// //                     <div className="lg:w-1/3">
// //                         <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
// //                             <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
// //                             <div className="space-y-3 text-sm">
// //                                 <div className="flex justify-between">
// //                                     <span className="text-gray-600">Subtotal</span>
// //                                     <span className="font-medium text-gray-900">
// //                                         Rp {subtotal.toLocaleString('id-ID')}
// //                                     </span>
// //                                 </div>
// //                                 {/* Tambahkan kalkulasi ongkir dan pajak di halaman checkout */}
// //                                 <div className="border-t border-gray-200 pt-3 flex justify-between">
// //                                     <span className="font-bold text-gray-900">Total</span>
// //                                     <span className="font-bold text-gray-900">
// //                                         Rp {subtotal.toLocaleString('id-ID')}
// //                                     </span>
// //                                 </div>
// //                             </div>
// //                             <button onClick={() => router.push('/checkout')} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-colors">
// //                                 Proceed to Checkout
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };



// // src/app/cart/page.tsx

// 'use client';
// import React, { useEffect, useMemo } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   TrashIcon,
//   PlusIcon,
//   MinusIcon,
//   ShoppingBagIcon,
//   ArrowLeftIcon,
// } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import {
//   fetchCartItems,
//   updateItemQuantity,
//   removeItemFromCart,
//   clearCartByStore,
// } from '@/lib/redux/slice/cartSlice';

// const formatRupiah = (amount: number) =>
//   `Rp ${amount.toLocaleString('id-ID')}`;

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { carts, status, error, loadingItemId  } = useAppSelector((state) => state.cart);
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(fetchCartItems());
//     }
//   }, [dispatch, isAuthenticated]);

//   const handleUpdateQuantity = (itemId: number, quantity: number) => {
//     if (quantity >= 1) dispatch(updateItemQuantity({ itemId, quantity }));
//   };

//   const handleRemoveItem = (itemId: number) => {
//     dispatch(removeItemFromCart(itemId));
//   };

//   const handleClearCart = (storeId: number) => {
//     if (confirm('Are you sure you want to clear all items from this store?')) {
//       dispatch(clearCartByStore(storeId));
//     }
//   };

//   const subtotal = useMemo(() => {
//     return carts.reduce(
//       (total, cart) =>
//         total +
//         cart.items.reduce(
//           (sum, item) => sum + item.product.basePrice * item.quantity,
//           0
//         ),
//       0
//     );
//   }, [carts]);

//   if (status === 'loading') {
//     return (
//       <div className="py-20 text-center">
//         <div className="h-10 w-10 animate-spin border-2 border-b-0 border-green-600 rounded-full mx-auto"></div>
//         <p className="text-gray-500 mt-4">Loading your cart...</p>
//       </div>
//     );
//   }

//   if (status === 'succeeded' && carts.length === 0) {
//     return (
//       <div className="py-24 text-center">
//         <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Your cart is empty
//         </h2>
//         <p className="text-gray-500 mb-6">Start adding some groceries now!</p>
//         <Link
//           href="/catalog"
//           className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-700"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* LEFT - CART ITEMS */}
//          <div className="lg:w-2/3 space-y-6">
//             {carts
//             .filter(cart => cart.items.length > 0) // ✅ Hanya tampilkan toko yang masih ada item
//             .map(cart => (
//             <div key={cart.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
//                 <h2 className="font-semibold text-gray-800">
//                     Items from: {cart.store.name}
//                 </h2>
//                 <button 
//                     onClick={() => handleClearCart(cart.storeId)}
//                     className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center"
//                 >
//                     <TrashIcon className="h-3 w-3 mr-1" /> Clear Cart
//                 </button>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {cart.items.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-center gap-4 px-4 py-4"
//                     >
//                       <img
//                         src={
//                           item.product.images[0]?.imageUrl ??
//                           'https://placehold.co/80x80/e2e8f0/ffffff?text=No+Image'
//                         }
//                         alt={item.product.name}
//                         className="w-16 h-16 rounded object-cover"
//                       />
//                       <div className="flex-1">
//                         <Link
//                           href={`/product/${item.product.id}`}
//                           className="text-sm font-medium text-gray-800 hover:text-green-600"
//                         >
//                           {item.product.name}
//                         </Link>
//                         <div className="mt-2 flex items-center gap-2">
//                           <button
//                             onClick={() =>
//                               handleUpdateQuantity(item.id, item.quantity - 1)
//                             }
//                             className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
//                           >
//                             {loadingItemId === item.id ? (
//                               <div className="h-4 w-4 animate-spin border-b-2 border-gray-400 rounded-full mx-auto" />
//                             ) : (
//                               <MinusIcon className="h-4 w-4" />
//                             )}
//                           </button>
//                           <span className="text-sm font-medium w-6 text-center">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() =>
//                               handleUpdateQuantity(item.id, item.quantity + 1)
//                             }
//                             className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
//                           > {loadingItemId === item.id ? (
//                               <div className="h-4 w-4 animate-spin border-b-2 border-gray-400 rounded-full mx-auto" />
//                             ) : (
//                             <PlusIcon className="h-4 w-4" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-gray-800 font-medium">
//                           {formatRupiah(item.product.basePrice)}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Total:{' '}
//                           {formatRupiah(
//                             item.product.basePrice * item.quantity
//                           )}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleRemoveItem(item.id)}
//                         className="text-gray-400 hover:text-red-500"
//                       >
//                         <TrashIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             <Link
//               href="/"
//               className="inline-flex items-center text-gray-600 hover:text-green-600 text-sm mt-4"
//             >
//               <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Shopping
//             </Link>
//           </div>

//           {/* RIGHT - ORDER SUMMARY */}
//           <div className="lg:w-1/3">
//             <div className="bg-gray-50 rounded-lg p-6 border">
//               <h2 className="text-lg font-bold text-gray-900 mb-4">
//                 Order Summary
//               </h2>
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium">{formatRupiah(subtotal)}</span>
//               </div>
//               <div className="border-t pt-3 flex justify-between text-sm font-bold">
//                 <span>Total</span>
//                 <span>{formatRupiah(subtotal)}</span>
//               </div>
//               <button
//                 onClick={() => router.push('/checkout')}
//                 className="mt-6 w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 text-sm font-medium"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import React, { useEffect, useMemo } from 'react';
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

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { carts, status, loadingItemId } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity >= 1) dispatch(updateItemQuantity({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeItemFromCart(itemId));
  };

  const handleClearCart = (storeId: number) => {
    if (confirm('Are you sure you want to clear all items from this store?')) {
      dispatch(clearCartByStore(storeId));
    }
  };

  const subtotal = useMemo(() => {
    return carts.reduce(
      (total, cart) =>
        total +
        cart.items.reduce(
          (sum, item) => sum + item.product.basePrice * item.quantity,
          0
        ),
      0
    );
  }, [carts]);

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
              onClick={() => router.push('/checkout')}
              className="mt-8 w-full bg-green-600 text-white py-4 rounded-full text-lg font-bold shadow-md hover:bg-green-700 active:scale-98 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              tabIndex={0}
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

