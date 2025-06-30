interface Discount {
  id: string;
  type: string;
  value: string;
  startDate: Date;
  endDate: Date;
}
interface DiscountTableProps {
  onEdit: (Discount: Discount) => void;
  onDelete: (DiscountId: string) => void;
  searchQuery: string;
  selectedCategory: string;
}