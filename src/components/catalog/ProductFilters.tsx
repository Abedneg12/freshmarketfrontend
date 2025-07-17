import React, { useState } from 'react';
import { CheckIcon, MinusIcon, PlusIcon } from 'lucide-react';
interface ProductFiltersProps {
  selectedFilters: {
    sortBy: string;
  };
  setSelectedFilters: React.Dispatch<React.SetStateAction<{
    sortBy: string;
  }>>;
}
export const ProductFilters = ({
  selectedFilters,
  setSelectedFilters
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    dietary: true,
    brands: true,
  });
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  return <div className="space-y-6">
      
      
      {/* Clear all filters button */}
      <button onClick={() => setSelectedFilters({
      sortBy: 'popular'
    })} className="text-sm text-green-600 hover:text-green-800 font-medium">
        Clear all filters
      </button>
    </div>;
};