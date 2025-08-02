import React, { useEffect, useState } from 'react';
import { StockReportFilters } from '@/components/reports/StockReportFilters';
import { DataTable } from '@/components/common/DataTable';
import axios from 'axios';
import { apiUrl } from '../../config';
import { useAppSelector } from '@/lib/redux/hooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Interface for the stock summary report data from the backend
interface StockSummaryReportItem {
  productName: string;
  beginningStock: number;
  totalAdditions: number;
  totalSubtractions: number;
  endingStock: number;
}

export default function StockReportsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    storeId: undefined as number | undefined,
  });

  const [reportData, setReportData] = useState<StockSummaryReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (
    newFilters: { year: number; month: number; storeId: number | undefined }
  ) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!token) return;

    const fetchStockReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/stocks/monthly-stock-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setReportData(response.data as StockSummaryReportItem[]);
      } catch (err: any) {
        console.error('Failed to fetch stock report:', err);
        setError(err.response?.data?.message || 'Failed to fetch stock report. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockReport();
  }, [token, filters]);

  const columns = [
    { label: 'Product Name', accessor: 'productName' },
    { label: 'Beginning Stock', accessor: 'beginningStock' },
    { label: 'Stock In', accessor: 'totalAdditions' },
    { label: 'Stock Out', accessor: 'totalSubtractions' },
    { label: 'Ending Stock', accessor: 'endingStock' },
  ];

  return (
    <div className="space-y-6 text-black">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Stock Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and analyze monthly stock movements.
        </p>
      </div>
      <StockReportFilters
        onFilterChange={handleFilterChange}
        initialYear={filters.year}
        initialMonth={filters.month}
      />

      {loading && <LoadingSpinner />}
      {error && <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg">{error}</div>}

      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Monthly Stock Summary
            </h3>
          </div>
          <DataTable
            columns={columns}
            data={reportData.map((item, index) => ({ ...item, id: index }))} // DataTable needs an 'id'
          />
        </div>
      )}
    </div>
  );
}