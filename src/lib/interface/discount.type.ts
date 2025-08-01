import { Product } from "./product.type";

export interface DiscountTableProps {
  onEdit: (Discount: Discount) => void;
  onDelete: (DiscountId: string) => void;
  searchQuery: string;
  selectedCategory: string;
}

export interface Discount {
  id: number;
  type: string; // e.g., 'PERCENTAGE', 'BUY1GET1', 'VOUCHER'
  storeId?: number;
  product?: Product;
  value: string;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxDiscount?: number;
}