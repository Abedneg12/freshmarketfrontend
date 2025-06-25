'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowLeftIcon } from 'lucide-react';
export const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([{
    id: 'p1',
    name: 'Organic Avocados',
    price: 4.99,
    quantity: 2,
    unit: '2 pack',
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    id: 'p5',
    name: 'Organic Milk',
    price: 4.29,
    quantity: 1,
    unit: '1/2 gallon',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    id: 'p4',
    name: 'Sourdough Bread',
    price: 5.49,
    quantity: 1,
    unit: '1 loaf',
    image: 'https://images.unsplash.com/photo-1585478259715-4ddc6572944d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? {
      ...item,
      quantity: newQuantity
    } : item));
  };
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'FRESH20') {
      setPromoApplied(true);
      setPromoDiscount(calculateSubtotal() * 0.2);
    } else {
      alert('Invalid promo code');
    }
  };
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.0725; // 7.25% tax rate
    const shipping = subtotal > 35 ? 0 : 5.99;
    const total = subtotal + tax + shipping - promoDiscount;
    return {
      subtotal,
      tax,
      shipping,
      total
    };
  };
  const {
    subtotal,
    tax,
    shipping,
    total
  } = calculateTotal();
  if (cartItems.length === 0) {
    return <div className="container mx-auto px-4 py-16 text-center">
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
      </div>;
  }
  return <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700 text-left">
                  <tr>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6 text-right">Price</th>
                    <th className="py-4 px-6 text-right">Total</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map(item => <tr key={item.id}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover mr-4" />
                          <div>
                            <Link href={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-green-600">
                              {item.name}
                            </Link>
                            <p className="text-gray-500 text-sm">{item.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center border border-gray-300 rounded-md w-24">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 text-gray-800 font-medium flex-grow text-center">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-black">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link href="/catalog" className="flex items-center justify-center text-gray-700 hover:text-green-600 font-medium">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
              <div className="flex-grow"></div>
              <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                <input type="text" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} disabled={promoApplied} className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <button onClick={applyPromoCode} disabled={promoApplied || !promoCode} className={`absolute right-0 top-0 bottom-0 px-4 rounded-r-md ${promoApplied ? 'bg-gray-300 text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {promoApplied && <div className="flex justify-between text-green-600">
                    <span>Promo (FRESH20)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              {shipping === 0 && <div className="mt-4 bg-green-50 border border-green-200 rounded p-3 flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-800">
                    You've qualified for free shipping!
                  </p>
                </div>}
              {shipping > 0 && <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 flex items-start">
                  <p className="text-sm text-blue-800">
                    Add ${(35 - subtotal).toFixed(2)} more to qualify for free
                    shipping.
                  </p>
                </div>}
              <button onClick={() => router.push('/checkout')} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-colors">
                Proceed to Checkout
              </button>
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By proceeding to checkout, you agree to our{' '}
                  <a href="#" className="text-gray-700 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-gray-700 underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                Accepted Payment Methods
              </h3>
              <div className="flex space-x-3">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">VISA</span>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">MC</span>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">AMEX</span>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">
                    PayPal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};