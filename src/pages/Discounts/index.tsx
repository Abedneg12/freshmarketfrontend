'use client';

import React from 'react';
const discountedProducts = [{
  id: 1,
  name: 'Fresh Blueberries',
  originalPrice: 6.99,
  discountedPrice: 4.99,
  unit: '12 oz',
  image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  discountPercentage: 28
}, {
  id: 2,
  name: 'Grass-Fed Ground Beef',
  originalPrice: 8.99,
  discountedPrice: 6.49,
  unit: '1 lb',
  image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  discountPercentage: 27
}, {
  id: 3,
  name: 'Organic Baby Spinach',
  originalPrice: 4.99,
  discountedPrice: 3.49,
  unit: '5 oz',
  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  discountPercentage: 30
}];
export const Discounts = () => {
  return <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Weekly Deals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save big on these specially selected items. New deals every week!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {discountedProducts.map(product => <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                {product.discountPercentage}% OFF
              </div>
              <div className="h-56 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-medium text-lg text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-500 mb-3">{product.unit}</p>
                <div className="flex items-center mb-4">
                  <span className="font-bold text-red-500 text-xl">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-400 line-through ml-2">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full w-full transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>)}
        </div>
        <div className="mt-12 text-center">
          <button className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-full font-medium transition-colors">
            View All Deals
          </button>
        </div>
      </div>
    </section>;
};