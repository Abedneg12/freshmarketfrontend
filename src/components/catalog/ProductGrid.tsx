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
import { Discount } from '@/lib/interface/discount.type';

interface ProductGridProps {
    category: string;
    searchTerm: string;
    filters: {
        sortBy: string;
    };
    dealsOnly?: boolean;
    selectedMarkets?: string[];
    storeId?: number;
}

// Helper function to calculate discounted price
const calculateDiscount = (product: Product, storeId: number) => {
    const applicableDiscount = product.discounts?.[0];

    if (!applicableDiscount) {
        return {
            finalPrice: product.basePrice,
            hasDiscount: false,
            discountType: null,
        };
    }

    if (applicableDiscount.storeId !== storeId || (applicableDiscount.product?.id && applicableDiscount.product?.id !== product.id)) {
        return {
            finalPrice: product.basePrice,
            hasDiscount: false,
            discountType: null,
        };
    }

    const now = new Date();
    const startDate = new Date(applicableDiscount.startDate);
    const endDate = new Date(applicableDiscount.endDate);

    if (now < startDate || now > endDate) {
        return {
            finalPrice: product.basePrice,
            hasDiscount: false,
            discountType: null,
        };
    }


    if (applicableDiscount.type === 'NOMINAL') {
        return {
            finalPrice: product.basePrice - parseFloat(applicableDiscount.value || '0'),
            hasDiscount: true,
            discountType: applicableDiscount.type,
        };
    }

    if (applicableDiscount.type === 'PERCENTAGE') {
        let discountAmount = (product.basePrice * parseFloat(applicableDiscount.value || '0')) / 100;
        if (applicableDiscount.maxDiscount && discountAmount > applicableDiscount.maxDiscount) {
            discountAmount = applicableDiscount.maxDiscount;
        }
        return {
            finalPrice: product.basePrice - discountAmount,
            hasDiscount: true,
            discountType: applicableDiscount.type,
        };
    }

    if (applicableDiscount.type === 'BUY1GET1') {
        return {
            finalPrice: product.basePrice,
            hasDiscount: true,
            discountType: applicableDiscount.type,
        };
    }


    return {
        finalPrice: product.basePrice,
        hasDiscount: false,
        discountType: null,
    };
};


export const ProductGrid = ({
    category,
    searchTerm,
    filters,
    dealsOnly,
    selectedMarkets,
    storeId
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
            if (storeId) {
                const result = await dispatch(fetchStoreProducts(storeId)).unwrap();
                setAllStoreProducts([result]);
                setLoading(false);
                return;
            } else {

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
            }
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
        console.log('All Flattened Products:', allFlattened);
        console.log('Selected Markets:', allStoreProducts);
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

        if (dealsOnly) {
            results = results.filter(({ product, storeId }) => {
                const { hasDiscount } = calculateDiscount(product, storeId);
                return hasDiscount;
            });
        }

        switch (filters?.sortBy) {
            case 'price-asc':
                results.sort((a, b) => {
                    const priceA = calculateDiscount(a.product, a.storeId).finalPrice;
                    const priceB = calculateDiscount(b.product, b.storeId).finalPrice;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                results.sort((a, b) => {
                    const priceA = calculateDiscount(a.product, a.storeId).finalPrice;
                    const priceB = calculateDiscount(b.product, b.storeId).finalPrice;
                    return priceB - priceA;
                });
                break;
            default:
                break;
        }
        setFilteredList(results);
    }, [searchTerm, category, filters, allStoreProducts, selectedMarkets, dealsOnly]);

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
                const isOutOfStock = product.stocks?.find(s => s.storeId === storeId)?.quantity === 0;
                const { finalPrice, hasDiscount, discountType } = calculateDiscount(product, storeId);


                return (
                    <div
                        key={`${product.id}-${storeId}`}
                        className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
                    >
                        <Link href={`/product/${product.id}?store=${storeId}`} className="block">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.images?.[0]?.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                />
                                {discountType === 'BUY1GET1' && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        BUY 1 GET 1
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link href={`/product/${product.id}?store=${storeId}`} className="block">
                                <h3 className="font-medium hover:text-green-600 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 italic">{storeName}</p>
                                {isOutOfStock && (
                                    <p className="text-xs text-red-500 font-semibold">Out of stock</p>
                                )}
                            </Link>
                            <div className="mt-2 flex justify-between items-center">
                                <div>
                                    {hasDiscount && discountType !== 'BUY1GET1' ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-red-500">
                                                Rp {finalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-gray-400 line-through text-sm">
                                                Rp {product.basePrice.toLocaleString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-green-600">
                                            Rp {product.basePrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
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