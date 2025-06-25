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
