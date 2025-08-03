import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { Market } from '@/lib/interface/market';
import axios from 'axios';
import { apiUrl } from '@/config';

export interface ReportFiltersProps {
  onFilterChange: (filters: { year?: number; storeId?: number }) => void;
  availableYears: number[];
  selectedYear: number;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFilterChange,
  availableYears,
  selectedYear,
}) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const [stores, setStores] = useState<Market[]>([]);

  // Local state for filters before applying
  const [year, setYear] = useState<number>(selectedYear);
  const [storeId, setStoreId] = useState<number | ''>('');

  const isStoreAdmin = user?.role === 'STORE_ADMIN';

  useEffect(() => {
    const fetchStores = async () => {
      // Only super admins can filter by store
      if (token && !isStoreAdmin) {
        try {
          const res = await axios.get(`${apiUrl}/stores/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStores(res.data as Market[]);
        } catch (error) {
          console.error('Failed to fetch stores', error);
        }
      }
    };
    fetchStores();
  }, [token, isStoreAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the selected filters up to the parent component
    onFilterChange({
      year,
      storeId: storeId === '' ? undefined : storeId,
    });
  };

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Report Filters</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Year Filter */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Store Filter (only for super admins) */}
          {!isStoreAdmin && (
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                Store
              </label>
              <select
                id="store"
                name="store"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
              >
                <option value="">All Stores</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};