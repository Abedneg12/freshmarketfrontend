import React, { useEffect, useState } from 'react';
import { StatsOverview } from './components/StatsOverview';
import { ReportChart } from './components/ReportChart';
import axios from 'axios';
import { apiUrl } from '../config';
import { useAppSelector } from '@/lib/redux/hooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Interfaces for API data
interface MonthlyReportDataItem {
  monthYear: string; // "2023-01"
  totalSales: number;
}

interface CategoryReportDataItem {
  name: string;
  totalSales: number;
  quantitySold: number;
}

interface MonthlySalesByCategoryReport {
  monthYear: string;
  categories: CategoryReportDataItem[];
}

// Interfaces for product sales API data
interface ProductReportDataItem {
  name: string;
  totalSales: number;
  quantitySold: number;
}
interface MonthlySalesByProductReport {
  monthYear: string;
  products: ProductReportDataItem[];
}
interface ChartData {
  name: string;
  revenue: number;
  orders: number;
}

export default function DashboardPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [productData, setProductData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const year = new Date().getFullYear();
        const headers = { Authorization: `Bearer ${token}` };
        const params = { year };

        const [monthlyRes, categoryRes, productRes] = await Promise.all([
          axios.get(`${apiUrl}/reports/monthly-sales`, { headers, params }),
          axios.get(`${apiUrl}/reports/monthly-sales-by-category`, { headers, params }),
          axios.get(`${apiUrl}/reports/monthly-sales-by-product`, { headers, params }),
        ]);

        // Process monthly sales data for revenue chart
        const fetchedMonthlyData = monthlyRes.data as MonthlyReportDataItem[];
        const transformedRevenueData = fetchedMonthlyData.map(item => ({
          name: new Date(item.monthYear).toLocaleString('default', { month: 'short' }),
          revenue: item.totalSales,
          orders: 0, // API doesn't provide order count, so default to 0
        })).sort((a, b) => new Date(`2000-${a.name}-01`).getTime() - new Date(`2000-${b.name}-01`).getTime());
        setRevenueData(transformedRevenueData);

        // Process and aggregate category sales data for category chart
        const fetchedCategoryData = categoryRes.data as MonthlySalesByCategoryReport[];
        const aggregatedCategoryData: { [key: string]: { revenue: number, orders: number } } = {};
        fetchedCategoryData.forEach(month => {
          month.categories.forEach(cat => {
            if (!aggregatedCategoryData[cat.name]) {
              aggregatedCategoryData[cat.name] = { revenue: 0, orders: 0 };
            }
            aggregatedCategoryData[cat.name].revenue += cat.totalSales;
            aggregatedCategoryData[cat.name].orders += cat.quantitySold;
          });
        });
        const transformedCategoryData = Object.entries(aggregatedCategoryData)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 7); // Show top 7 categories
        setCategoryData(transformedCategoryData);

        // Process and aggregate product sales data for product chart
        const fetchedProductData = productRes.data as MonthlySalesByProductReport[];
        const aggregatedProductData: { [key: string]: { revenue: number, orders: number } } = {};
        fetchedProductData.forEach(month => {
          month.products.forEach(prod => {
            if (!aggregatedProductData[prod.name]) {
              aggregatedProductData[prod.name] = { revenue: 0, orders: 0 };
            }
            aggregatedProductData[prod.name].revenue += prod.totalSales;
            aggregatedProductData[prod.name].orders += prod.quantitySold;
          });
        });
        const transformedProductData = Object.entries(aggregatedProductData)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 7); // Show top 7 products
        setProductData(transformedProductData);

      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.response?.data?.message || "An error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          A summary of your grocery business performance.
        </p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <>
          <StatsOverview />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ReportChart data={revenueData} type="line" title="Revenue Trend (This Year)" />
            <ReportChart data={categoryData} type="bar" title="Top Categories by Revenue" />
            <div className="lg:col-span-2">
              <ReportChart data={productData} type="bar" title="Top Products by Revenue" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};