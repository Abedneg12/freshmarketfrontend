import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface ProductFiltersProps {
  selectedFilters: {
    sortBy: string;
  };
  setSelectedFilters: React.Dispatch<React.SetStateAction<{
    sortBy: string;
  }>>;
  setActiveCategory: (categoryId: string) => void;
  selectedMarkets: string[];
  setSelectedMarkets: (ids: string[]) => void;
  markets: { id: number; name: string }[];
}

export const ProductFilters = ({
  selectedFilters,
  setSelectedFilters,
  setActiveCategory,
  selectedMarkets,
  setSelectedMarkets,
  markets
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    market: true,
  });

  const toggleMarket = (id: string) => {
    if (selectedMarkets.includes(id)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== id));
    } else {
      setSelectedMarkets([...selectedMarkets, id]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Market filter */}
      <div>
        <button
          onClick={() => toggleSection('market')}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900"
        >
          <span>Markets</span>
          {expandedSections.market ? <MinusIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
        </button>
        {expandedSections.market && (
          <div className="mt-3 space-y-2">
            {markets.map(store => (
              <label key={store.id} className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  value={store.id}
                  checked={selectedMarkets.includes(String(store.id))}
                  onChange={() => toggleMarket(String(store.id))}
                  className="mr-2"
                />
                {store.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear all filters */}
      <button
        onClick={() => {
          setSelectedFilters({ sortBy: 'price-asc' });
          setActiveCategory('all');
          setSelectedMarkets([]);
        }}
        className="text-sm text-green-600 hover:text-green-800 font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
};
