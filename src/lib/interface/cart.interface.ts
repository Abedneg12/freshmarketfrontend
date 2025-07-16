export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  carts: CartItem[];
  totalQuantity: number;
}

export interface CartCountResponse {
  totalQuantity: number;
}

export interface UpdateItemResponse {
  item: CartItem;
}
