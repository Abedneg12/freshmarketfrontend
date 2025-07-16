export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface StoreRecommendation {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  distanceKm: number;
  products: Product[];
}

export type Market = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  imageUrl?: string | null;
  createdAt: string; // ISO date string
  admins?: any[];      // You can define a more specific type for admins if needed
  products?: any[];    // Stock[]
  orders?: any[];
  discounts?: any[];
  journals?: any[];
  carts?: any[];
};

