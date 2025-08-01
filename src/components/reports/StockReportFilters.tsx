import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { Market } from '@/lib/interface/market';
import axios from 'axios';
import { apiUrl } from '@/pages/config';

interface StockReportFiltersProps {
  onFilterChange: (filters: { year: number; month: number; storeId: number | undefined }) => void;
  initialYear: number;
  initialMonth: number;
}

export const StockReportFilters = ({ onFilterChange, initialYear, initialMonth }: StockReportFiltersProps) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const [stores, setStores] = useState<Market[]>([]);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [storeId, setStoreId] = useState<number | ''>('');

  const isStoreAdmin = user?.role === "STORE_ADMIN";

  useEffect(() => {
    const fetchStores = async () => {
      if (token) {
        try {
          const res = await axios.get(`${apiUrl}/stores/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStores(res.data as Market[]);
        } catch (error) {
          console.error("Failed to fetch stores for filter", error);
        }
      }
    };
    if (!isStoreAdmin) {
        fetchStores();
    }
  }, [token, isStoreAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ year, month, storeId: storeId === '' ? undefined : storeId });
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = [
      { value: 1, label: 'January' }, { value: 2, label: 'February' },
      { value: 3, label: 'March' }, { value: 4, label: 'April' },
      { value: 5, label: 'May' }, { value: 6, label: 'June' },
      { value: 7, label: 'July' }, { value: 8, label: 'August' },
      { value: 9, label: 'September' }, { value: 10, label: 'October' },
      { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Report Filters
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select id="year" name="year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select id="month" name="month" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          {!isStoreAdmin && (
            <div>
                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">
                Store
                </label>
                <select id="storeId" name="storeId" value={storeId} onChange={(e) => setStoreId(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
                <option value="">All Stores</option>
                {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};