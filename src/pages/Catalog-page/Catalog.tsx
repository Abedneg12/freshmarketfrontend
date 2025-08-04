"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductFilters } from "../../components/catalog/ProductFilters";
import { ProductGrid } from "../../components/catalog/ProductGrid";
import { SearchIcon, SlidersIcon, XIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCategory } from "@/lib/redux/slice/categorySlice";

export default function CatalogPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams() || new URLSearchParams();
    const dispatch = useAppDispatch();

    // 1. Initialize state from URL search params
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
    const [selectedMarkets, setSelectedMarkets] = useState<string[]>(
        searchParams.get("markets")?.split(',') || []
    );
    const [selectedFilters, setSelectedFilters] = useState<{ sortBy: string }>({
        sortBy: searchParams.get("sortBy") || "",
    });

    const [showFilters, setShowFilters] = useState(false);
    const categories = useAppSelector((state) => state.category.data);
    const markets = useAppSelector((state) => state.Market.data);

    useEffect(() => {
        dispatch(fetchCategory());
    }, [dispatch]);

    // 2. Update URL search params when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        if (activeCategory !== "all") {
            params.set("category", activeCategory);
        } else {
            params.delete("category");
        }
        if (selectedMarkets.length > 0) {
            params.set("markets", selectedMarkets.join(','));
        } else {
            params.delete("markets");
        }
        if (selectedFilters.sortBy !== "Default") {
            params.set("sortBy", selectedFilters.sortBy);
        } else {
            params.delete("sortBy");
        }

        // Use router.replace to update the URL without adding to the history stack
        router.replace(`${pathname}?${params.toString()}`);
    }, [searchTerm, activeCategory, selectedMarkets, selectedFilters, pathname, router, searchParams]);

    return (
        <div className="bg-white text-gray-900">
            <div className="container mx-auto px-4 py-8">
                {searchParams.get("deals") === "true" && (
                    <div className="mb-8 bg-red-50 rounded-xl p-8 text-center">
                        <span className="text-red-600 font-medium text-sm uppercase tracking-wide">
                            Limited Time
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
                            Today's Best Deals
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Save big on fresh produce, pantry essentials, and more. All deals
                            are for a limited time only - shop now before they're gone!
                        </p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {!searchParams.get("deals") && (
                        <div className="md:hidden mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 py-3 px-4 rounded-lg text-gray-700"
                            >
                                <SlidersIcon className="h-5 w-5" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                        </div>
                    )}

                    {!searchParams.get("deals") && (
                        <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 lg:w-1/5`}>
                            <div className="sticky top-24">
                                <div className="md:hidden flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">Filters</h2>
                                    <button onClick={() => setShowFilters(false)} className="text-gray-500">
                                        <XIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                                    <ul className="space-y-2">
                                        <li key="all">
                                            <button
                                                className={`text-sm w-full text-left py-1 px-2 rounded-md ${activeCategory === "all"
                                                    ? "bg-green-50 text-green-700 font-medium"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                onClick={() => setActiveCategory("all")}
                                            >
                                                All Categories
                                            </button>
                                        </li>
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <button
                                                    className={`text-sm w-full text-left py-1 px-2 rounded-md ${activeCategory === String(category.id)
                                                        ? "bg-green-50 text-green-700 font-medium"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => setActiveCategory(String(category.id))}
                                                >
                                                    {category.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <ProductFilters
                                    selectedFilters={selectedFilters}
                                    setSelectedFilters={setSelectedFilters}
                                    setActiveCategory={setActiveCategory}
                                    selectedMarkets={selectedMarkets}
                                    setSelectedMarkets={setSelectedMarkets}
                                    markets={markets}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`${searchParams.get("deals") ? "w-full" : "md:w-3/4 lg:w-4/5"}`}>
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            {!searchParams.get("deals") && (
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            )}
                            <select
                                className="py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                                value={selectedFilters.sortBy}
                                onChange={(e) =>
                                    setSelectedFilters({
                                        ...selectedFilters,
                                        sortBy: e.target.value,
                                    })
                                }
                            >
                                <option value="Default">Default</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>

                        <ProductGrid
                            category={activeCategory}
                            searchTerm={searchTerm}
                            filters={selectedFilters}
                            dealsOnly={searchParams.get("deals") === "true"}
                            selectedMarkets={selectedMarkets}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}