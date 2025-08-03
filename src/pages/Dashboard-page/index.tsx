'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config';
import { useAppSelector } from '@/lib/redux/hooks';
import { ReportChart } from '@/components/reports/ReportChart';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { MonthlyReportDataItem, MonthlySalesByCategoryReport } from '@/lib/interface/report.type';

interface DashboardSummary {
  totalRevenue: number;
  totalProductsSold: number;
}

const StatCard = ({ title, value }: { title: string; value: string | number; }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default function DashboardPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${token}` };
      const currentYear = new Date().getFullYear();
      const params = { year: currentYear };

      try {
        const [monthlySalesRes, categorySalesRes] = await Promise.all([
          axios.get<MonthlyReportDataItem[]>(`${apiUrl}/sales/monthly-sales`, { headers, params }),
          axios.get<MonthlySalesByCategoryReport[]>(`${apiUrl}/sales/monthly-sales-by-category`, { headers, params }),
        ]);
        
        // 1. Process Monthly Sales for Chart and Total Revenue
        const monthlySales = monthlySalesRes.data;
        const totalRevenue = monthlySales.reduce((acc, month) => acc + month.totalSales, 0);

        const chartData = monthlySales.map(item => ({
          name: format(new Date(item.monthYear), 'MMM'),
          revenue: item.totalSales,
        })).sort((a, b) => new Date(`2000-${a.name}-01`).getTime() - new Date(`2000-${b.name}-01`).getTime());
        setMonthlySalesData(chartData);

        // 2. Process Category Sales for Total Products Sold
        console.log('Category Sales Data:', categorySalesRes.data);
        const categorySales = categorySalesRes.data;
        const totalProductsSold = categorySales.reduce((acc, month) => {
          return acc + month.categories.reduce((catAcc, category) => catAcc + category.quantitySold, 0);
        }, 0);

        // 3. Set the summary state
        setSummary({
          totalRevenue,
          totalProductsSold,
        });

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(value);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="space-y-8 text-black">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back! Here's a summary of your business performance for the year.
        </p>
      </div>

      {/* --- Key Stats --- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard title="Total Revenue (YTD)" value={formatCurrency(summary?.totalRevenue || 0)} />
        <StatCard title="Total Products Sold (YTD)" value={summary?.totalProductsSold || 0} />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Performance ({new Date().getFullYear()})</h3>
          <div style={{ height: '350px' }}>
            <ReportChart data={monthlySalesData} type="line" title="" />
          </div>
        </div>
      </div>
    </div>
  );
}