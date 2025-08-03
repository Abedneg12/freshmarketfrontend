// Define interfaces for the report data structures from your backend
export interface MonthlyReportDataItem {
  monthYear: string; // e.g., "2023-01"
  totalSales: number;
  stores: { name: string; totalSales: number }[];
}

export interface CategoryReportDataItem {
  name: string; // Category name
  totalSales: number;
  quantitySold: number;
}

export interface MonthlySalesByCategoryReport {
  monthYear: string;
  categories: CategoryReportDataItem[];
}

export interface ProductReportDataItem {
  name: string; // Product name
  totalSales: number;
  quantitySold: number;
}

export interface MonthlySalesByProductReport {
  monthYear: string;
  products: ProductReportDataItem[];
}