// export interface Discount {
//   id: string;
//   type: string;
//   value: string;
//   startDate: Date;
//   endDate: Date;
// }
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
  productId?: number;
  value: string;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxDiscount?: number;
}