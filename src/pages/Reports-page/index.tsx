import React, { useEffect, useState } from 'react';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ReportChart } from '@/components/reports/ReportChart';
import axios from 'axios';
import { apiUrl} from '../config'; // Assuming config is in the parent directory
import { useAppSelector } from '@/lib/redux/hooks';

// Define interfaces for the report data structures from your backend
interface MonthlyReportDataItem {
  monthYear: string; // e.g., "2023-01"
  totalSales: number;
  stores: { name: string; totalSales: number }[];
}

interface CategoryReportDataItem {
  name: string; // Category name
  totalSales: number;
  quantitySold: number;
}

interface MonthlySalesByCategoryReport {
  monthYear: string;
  categories: CategoryReportDataItem[];
}

interface ProductReportDataItem {
  name: string; // Product name
  totalSales: number;
  quantitySold: number;
}

interface MonthlySalesByProductReport {
  monthYear: string;
  products: ProductReportDataItem[];
}

export default function ReportsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [selectedFilters, setSelectedFilters] = useState({
    year: new Date().getFullYear(), // Default to current year
    storeId: undefined as number | undefined, // Default to all stores
  });

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (filters: { year?: number; storeId?: number }) => {
    setSelectedFilters(prev => ({
      ...prev,
      ...filters,
      storeId: filters.storeId === null || filters.storeId === undefined ? undefined : filters.storeId,
    }));
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      const { year, storeId } = selectedFilters;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const params = {
        year,
        ...(storeId !== undefined && { storeId }), // Only add storeId if it's defined
      };

      try {
        // Fetch Monthly Sales Report
        const monthlySalesRes = await axios.get<MonthlyReportDataItem[]>(
          `${apiUrl}/sales/monthly-sales`,
          { headers, params }
        );
        const fetchedMonthlyData = monthlySalesRes.data;

        // Transform data for Monthly Performance Chart
        const chartMonthlyData = fetchedMonthlyData.map(item => ({
          name: new Date(item.monthYear).toLocaleString('en-US', { month: 'short' }),
          revenue: item.totalSales,
          orders: item.stores.reduce((sum, store) => sum + store.totalSales, 0) > 0 ? 1 : 0, // Placeholder for orders, as API doesn't provide count
        })).sort((a,b) => new Date(`2000-${a.name}-01`).getTime() - new Date(`2000-${b.name}-01`).getTime()); // Sort by month

        setMonthlyData(chartMonthlyData);

        // Fetch Monthly Sales by Category Report
        const categorySalesRes = await axios.get<MonthlySalesByCategoryReport[]>(
          `${apiUrl}/sales/monthly-sales-by-category`,
          { headers, params }
        );
        const fetchedCategoryData = categorySalesRes.data;

        // Transform data for Category Performance Chart (overall per category)
        const overallCategorySales: { [key: string]: { revenue: number, orders: number } } = {};
        fetchedCategoryData.forEach(monthReport => {
          monthReport.categories.forEach(category => {
            if (!overallCategorySales[category.name]) {
              overallCategorySales[category.name] = { revenue: 0, orders: 0 };
            }
            overallCategorySales[category.name].revenue += category.totalSales;
            overallCategorySales[category.name].orders += category.quantitySold;
          });
        });
        const chartCategoryData = Object.entries(overallCategorySales).map(([name, data]) => ({
          name,
          revenue: data.revenue,
          orders: data.orders,
        })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue desc
        setCategoryData(chartCategoryData);

        // Fetch Monthly Sales by Product Report
        const productSalesRes = await axios.get<MonthlySalesByProductReport[]>(
          `${apiUrl}/sales/monthly-sales-by-product`,
          { headers, params }
        );
        const fetchedProductData = productSalesRes.data;

        // Transform data for Product Performance Chart (Overall Product Performance)
        const overallProductSales: { [key: string]: { revenue: number, orders: number } } = {};
        fetchedProductData.forEach(monthReport => {
            monthReport.products.forEach(product => {
                if (!overallProductSales[product.name]) {
                    overallProductSales[product.name] = { revenue: 0, orders: 0 };
                }
                overallProductSales[product.name].revenue += product.totalSales;
                overallProductSales[product.name].orders += product.quantitySold;
            });
        });
        const chartProductData = Object.entries(overallProductSales).map(([name, data]) => ({
            name,
            revenue: data.revenue,
            orders: data.orders,
        })).sort((a,b) => b.revenue - a.revenue); // Sort by revenue desc
        setProductData(chartProductData);

        // Transform data for Sales Data Table (flattened monthly category sales)
        const tableRows: any[] = [];
        fetchedCategoryData.forEach(monthReport => {
          monthReport.categories.forEach(category => {
            tableRows.push({
              date: monthReport.monthYear, // We're using month-year for "Date"
              store: selectedFilters.storeId ? `Store ID: ${selectedFilters.storeId}` : 'All Selected Stores', // More accurate
              category: category.name,
              orders: category.quantitySold,
              revenue: category.totalSales,
            });
          });
        });
        setTableData(tableRows);

      } catch (err: any) {
        console.error('Failed to fetch reports:', err);
        setError(err.response?.data?.message || 'Failed to fetch reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedFilters]); // Re-fetch when filters change

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 text-black">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View detailed reports and analyze store performance.
        </p>
      </div>
      <ReportFilters onFilterChange={handleFilterChange} />

      {loading && <div className="text-center text-gray-500 py-8">Loading reports...</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 ">
            <ReportChart data={monthlyData} type="line" title="Monthly Performance" />
            <ReportChart data={categoryData} type="bar" title="Category Performance" />
            <ReportChart data={productData} type="bar" title="Product Performance" />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Sales Data by Category
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Store Filter
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Sold
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.length > 0 ? (
                      tableData.map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(row.date).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.store}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.orders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(row.revenue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No data available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}