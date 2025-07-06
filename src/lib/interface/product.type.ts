export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface StoreStock {
  id: number;
  storeId: number;
  storeName: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: ProductCategory;
  categoryId: number;
  createdAt: string; // ISO date string
  images?: ProductImage[];
  stocks?: StoreStock[];
  storeAllocation?: InventoryStock[]; // Store distribution
}

export interface InventoryStock {
  id: number;
  storeId: number;
  type: string;
  quantity: number;
}