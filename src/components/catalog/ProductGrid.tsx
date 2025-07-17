import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';
import { Product, storeProduct } from '@/lib/interface/product.type';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchStoreProducts } from '@/lib/redux/slice/storeProductSlice';
import { apiUrl } from '@/pages/config';
import axios from 'axios';
interface ProductGridProps {
  category: string;
  searchTerm: string;
  filters: {
    sortBy: string;
  };
  dealsOnly?: boolean;
  storeId?: string;
}

export const ProductGrid = ({
  category,
  searchTerm,
  filters,
  dealsOnly,
  storeId
}: ProductGridProps) => {
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const [allStoreProducts, setAllStoreProducts] = useState<storeProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [Products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { data: markets, loading: storesLoading } = useAppSelector((state) => state.store);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product`,
        {
          headers: {
            Authorization: `Bearer ${"token"}`,
            'Content-Type': 'application/json',
          }
        }
      );
      setProducts(res.data as Product[]);
    } catch (error) {
      alert('Failed to fetch Products');
      console.error('Failed to fetch Products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!markets) return;
      const all: storeProduct[] = [];
      for (const store of markets) {
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
    fetchProducts();
  }, [markets, dispatch]);

  //console.log('All Store Products:', allProducts);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {

      let filteredProducts = [...allProducts];
      // Filter by store if storeId is provided
      if (storeId) {
        // In a real app, you would filter based on actual store inventory
        // For now, we'll just show a subset of products
        filteredProducts = filteredProducts.filter((_, index) => index % 2 === 0);
      }
      // if (dealsOnly) {
      //   filteredProducts = filteredProducts.filter(p => p.);
      // }
      if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category.name === category);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(term));
      }

      switch (filters.sortBy) {
        case 'discount':
          filteredProducts.sort((a, b) => {
            const discountA = a.price ? (a.basePrice - a.price) / a.basePrice : 0;
            const discountB = b.price ? (b.basePrice - b.price) / b.basePrice : 0;
            return discountB - discountA;
          });
          break;
        case 'price-asc':
          filteredProducts.sort((a, b) => (a.price || a.basePrice) - (b.price || b.basePrice));
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => (b.price || b.basePrice) - (a.price || a.basePrice));
          break;
        default:
          filteredProducts.sort((a, b) => {
            const discountA = a.price ? (a.basePrice - a.price) / a.basePrice : 0;
            const discountB = b.price ? (b.basePrice - b.price) / b.basePrice : 0;
            return discountB - discountA;
          });
      }
      //setProducts(allProducts);
      setLoading(false);
    }, 800);
  }, [category, searchTerm, filters, dealsOnly, storeId]);
  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      </div>)}
    </div>;
  }
  if (Products.length === 0) {
    return <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search term
      </p>
    </div>;
  }
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Products.map(product => <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img src={product.images?.[0]?.imageUrl} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-gray-800 hover:text-green-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex justify-between items-center">
          <div>
            {product.price ? <div className="flex items-center">
              <span className="font-bold text-red-500">
                Rp.{product.basePrice.toFixed(0)}
              </span>
              <span className="text-gray-400 line-through ml-2 text-sm">
                Rp.{product.basePrice.toFixed(0)}
              </span>
            </div> : <span className="font-bold text-green-600">
              Rp.{product.basePrice.toFixed(0)}
            </span>}
          </div>
          <button className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-2 transition-colors">
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>)}
  </div>;
};