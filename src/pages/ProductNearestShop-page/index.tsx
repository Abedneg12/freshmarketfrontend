'use client';
import { StoreAdminAssignment } from '@/lib/interface/admins.type';
import { Product, storeProduct } from '@/lib/interface/product.type';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchStoreProducts } from '@/lib/redux/slice/storeProductSlice';
import React, { JSX, useEffect, useState } from 'react';

export const ProductNearestShop = () => {
  const dispatch = useAppDispatch();
  const [allStoreProducts, setAllStoreProducts] = React.useState<storeProduct[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { data: nearbyStore } = useAppSelector((state) => state.store);

  useEffect(() => {
    const fetchAll = async () => {
      if (!nearbyStore) return;
      const all: storeProduct[] = [];
      for (const store of nearbyStore) {
        const result = await dispatch(fetchStoreProducts(store.id)).unwrap();
        if (Array.isArray(result)) {
          all.push(...result);
        } else {
          all.push(result);
        }
      }
      setAllStoreProducts(all);
      setAllProducts(all.flatMap(store => store.products));
    };
    fetchAll();
  }, [nearbyStore, dispatch]);

  // Remove duplicate products by id, keeping the first occurrence (from the nearest shop)
  const uniqueProductsMap = new Map();
  for (const product of allProducts) {
    if (!uniqueProductsMap.has(product.id)) {
      uniqueProductsMap.set(product.id, product);
    }
  }
  const uniqueProducts : storeProduct[]= Array.from(uniqueProductsMap.values());

  // Limit to 8 unless showAll is true
  const productsToShow = showAll ? uniqueProducts : uniqueProducts.slice(0, 8);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Product from nearest shop</h2>
          {!showAll && uniqueProducts.length > 8 && (
            <button
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
              onClick={() => setShowAll(true)}
            >
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {(() => {
    const shownProductIds = new Set<number>();
    const productCards: JSX.Element[] = [];
    outer: for (const store of allStoreProducts) {
      for (const product of store.products) {
        if (!shownProductIds.has(product.id)) {
          shownProductIds.add(product.id);
          productCards.push(
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.images?.[0]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <div className="mt-2 flex justify-between items-center text-gray-800">
                  <h3 className="font-medium">{store.name}</h3>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-green-600">
                    Rp.{(product.price ?? product.basePrice)?.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          );
          if (!showAll && productCards.length >= 8) break outer;
        }
      }
    }
    return productCards;
  })()}
</div>
      </div>
    </section>
  );
};