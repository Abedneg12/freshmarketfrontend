import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilters } from '../../components/catalog/ProductFilters';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { SearchIcon, SlidersIcon, XIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCategory } from '@/lib/redux/slice/categorySlice';


export default function CatalogPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState(searchParams?.get('category') || 'all');
  const [selectedFilters, setSelectedFilters] = useState<{
    sortBy: string;
  }>({
    sortBy: 'popular'
  });

  const categories = useAppSelector(state => state.category.data);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams?.get('deals') === 'true') {
      // Handle deals filter
    }
    if (searchParams?.get('promo')) {
      // Handle promo code
    }
  }, [searchParams]);
  
  return <div className="bg-white text-gray-900">
    <div className="container mx-auto px-4 py-8">
      {/* Deals Header - Only show when deals=true */}
      {searchParams?.get('deals') === 'true' && <div className="mb-8 bg-red-50 rounded-xl p-8 text-center">
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
      </div>}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filters button */}
        {!searchParams?.get('deals') && <div className="md:hidden mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-center gap-2 bg-gray-100 py-3 px-4 rounded-lg text-gray-700">
            <SlidersIcon className="h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>}
        {/* Filters sidebar - hide on deals page */}
        {!searchParams?.get('deals') && <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
          <div className="sticky top-24">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-500">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(category => <li key={category.id}>
                  <button className={`text-sm w-full text-left py-1 px-2 rounded-md ${activeCategory === String(category.id) ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory(String(category.id))}>
                    {category.name}
                  </button>
                </li>)}
              </ul>
            </div>
            <ProductFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </div>
        </div>}
        {/* Main content */}
        <div className={`${searchParams?.get('deals') ? 'w-full' : 'md:w-3/4 lg:w-4/5'}`}>
          {/* Search and sort bar - hide search on deals page */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {!searchParams?.get('deals') && <div className="relative flex-grow">
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>}
            <select className="py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white" value={selectedFilters.sortBy} onChange={e => setSelectedFilters({
              ...selectedFilters,
              sortBy: e.target.value
            })}>
              <option value="discount">Biggest Discount</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          {/* Products grid */}
          <ProductGrid category={activeCategory} searchTerm={searchTerm} filters={selectedFilters} dealsOnly={searchParams?.get('deals') === 'true'} />
        </div>
      </div>
    </div>
  </div>;
};