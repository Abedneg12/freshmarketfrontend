import { Discount } from "./discount.type";
import { Market } from "./market";

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
  store: Market; 
  quantity: number;
  type: 'IN' | 'OUT'; // Assuming type can be 'IN' or 'OUT'
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  category: ProductCategory;
  categoryId: number;
  createdAt: string; // ISO date string
  images?: ProductImage[];
  stocks?: StoreStock[];
  discounts?: Discount[]; 
}

export interface storeProduct {
  id: number;
  address: string;
  imageUrl: string;
  name: string;
  products: Product[];
}