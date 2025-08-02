'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';
import { Product, storeProduct } from '@/lib/interface/product.type';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchStoreProducts } from '@/lib/redux/slice/storeProductSlice';
import { fetchMarket } from '@/lib/redux/slice/storeSlice';
import { addItemToCart } from '@/lib/redux/slice/cartSlice';
import { toast } from 'react-toastify';

interface ProductGridProps {
    category: string;
    searchTerm: string;
    filters: {
        sortBy: string;
    };
    dealsOnly?: boolean;
    selectedMarkets?: string[];
}

export const ProductGrid = ({
    category,
    searchTerm,
    filters,
    dealsOnly,
    selectedMarkets
}: ProductGridProps) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [filteredList, setFilteredList] = useState<{ product: Product; storeId: number }[]>([]);
    const [allStoreProducts, setAllStoreProducts] = useState<storeProduct[]>([]);
    const { data: markets } = useAppSelector((state) => state.Market);

    useEffect(() => {
        const fetchAll = async () => {
            if (!markets || markets.length === 0) {
                await dispatch(fetchMarket());
                return;
            }

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
            setLoading(false);
        };
        fetchAll();
    }, [markets, dispatch]);

    useEffect(() => {
        const allFlattened: { product: Product; storeId: number }[] = [];
        allStoreProducts.forEach(store => {
            store.products.forEach(product => {
                allFlattened.push({ product, storeId: store.id });
            });
        });

        let results = [...allFlattened];
        if (selectedMarkets && selectedMarkets.length > 0) {
            results = results.filter(p => selectedMarkets.includes(String(p.storeId)));
        }
        if (category !== 'all') {
            results = results.filter(p => String(p.product.category.id) === category);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(p => p.product.name.toLowerCase().includes(term));
        }
        switch (filters?.sortBy) {
            case 'price-asc':
                results.sort((a, b) => (a.product.price || a.product.basePrice) - (b.product.price || b.product.basePrice));
                break;
            case 'price-desc':
                results.sort((a, b) => (b.product.price || b.product.basePrice) - (a.product.price || a.product.basePrice));
                break;
            default:
                break;
        }
        setFilteredList(results);
    }, [searchTerm, category, filters, allStoreProducts, selectedMarkets]);

    // 2. Buat fungsi handler untuk menambah item ke keranjang
    const handleAddToCart = (productId: number, storeId: number) => {
        dispatch(addItemToCart({ productId, storeId, quantity: 1 }))
            .unwrap()
            .then(() => {
                toast.success('Produk berhasil ditambahkan ke keranjang!');
            })
            .catch((error) => {
                toast.error(error.message || 'Gagal menambahkan produk.');
            });
    };


    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (filteredList.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map(({ product, storeId }) => {
                const store = markets.find(m => m.id === storeId);
                const storeName = store?.name || 'Unknown Store';
                const isOutOfStock = product.stocks?.find(s => s.quantity === 0)?.quantity === 0;

                return (
                    <div
                        key={`${product.id}-${storeId}`}
                        className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
                    >
                        <Link href={`/product/${product.id}`} className="block">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.images?.[0]?.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link href={`/product/${product.id}`} className="block">
                                <h3 className="font-medium hover:text-green-600">{product.name}</h3>
                                <p className="text-sm text-gray-500 italic">{storeName}</p>
                                {isOutOfStock && (
                                    <p className="text-xs text-red-500 font-semibold">Out of stock</p>
                                )}
                            </Link>
                            <div className="mt-2 flex justify-between items-center">
                                <div>
                                    {product.price ? (
                                        <div className="flex items-center">
                                            <span className="font-bold text-red-500">
                                                Rp.{product.price.toFixed(0)}
                                            </span>
                                            <span className="text-gray-400 line-through ml-2 text-sm">
                                                Rp.{product.basePrice.toFixed(0)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-green-600">
                                            Rp.{product.basePrice.toFixed(0)}
                                        </span>
                                    )}
                                </div>
                                {/* 3. Hubungkan tombol ke handler */}
                                <button
                                    onClick={() => handleAddToCart(product.id, storeId)}
                                    disabled={isOutOfStock}
                                    className={`rounded-full p-2 transition-colors ${isOutOfStock
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                                    }`}
                                >
                                    <ShoppingCartIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
