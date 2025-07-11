// src/redux/slice/cartSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// --- Tipe Data ---
interface Product {
  id: number;
  name: string;
  basePrice: number;
  images: { imageUrl: string }[];
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Cart {
    id: number;
    storeId: number;
    items: CartItem[];
    store: {
        id: number;
        name: string;
    }
}

interface CartState {
  carts: Cart[];
  totalQuantity: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  carts: [],
  totalQuantity: 0,
  status: 'idle',
  error: null,
};



// GET /api/cart -> Mengambil semua item di keranjang
export const fetchCartItems = createAsyncThunk<Cart[], void, { state: RootState }>(
  'cart/fetchItems',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL }/cart/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// GET /api/cart/count -> Mengambil jumlah total item
export const fetchCartCount = createAsyncThunk<number, void, { state: RootState }>(
  'cart/fetchCount',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<{ count: number }>(`${process.env.NEXT_PUBLIC_API_URL }/cart/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.count;
  }
);

// POST /api/cart/add -> Menambah item baru
export const addItemToCart = createAsyncThunk<Cart[], { productId: number; storeId: number; quantity: number }, { state: RootState }>(
  'cart/addItem',
  async (item, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.post<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL }/cart/add`, item, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// PATCH /api/cart/items/:itemId -> Mengubah kuantitas item
export const updateItemQuantity = createAsyncThunk<Cart[], { itemId: number; quantity: number }, { state: RootState }>(
  'cart/updateItemQuantity',
  async ({ itemId, quantity }, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.patch<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL }/cart/items/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// DELETE /api/cart/items/:itemId -> Menghapus satu item
export const removeItemFromCart = createAsyncThunk<Cart[], number, { state: RootState }>(
  'cart/removeItem',
  async (itemId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.delete<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL }/cart/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// DELETE /api/cart/stores/:storeId -> Mengosongkan keranjang untuk satu toko
export const clearCartByStore = createAsyncThunk<Cart[], number, { state: RootState }>(
    'cart/clearByStore',
    async (storeId, { getState }) => {
        const token = getState().auth.token;
        const response = await axios.delete<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL }/cart/stores/${storeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

// --- Helper untuk Kalkulasi Ulang State ---
const updateStateFromCarts = (state: CartState, carts: Cart[]) => {
    state.carts = carts;
    state.totalQuantity = carts.reduce((total, cart) => 
        total + cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
};

// --- SLICE ---

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartOnLogout: (state) => {
      state.carts = [];
      state.totalQuantity = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => { state.status = 'loading'; };
    const handleRejected = (state: CartState, action: any) => {
        state.status = 'failed';
        state.error = action.error.message || 'Terjadi kesalahan pada keranjang';
    };
    const handleFulfilled = (state: CartState, action: PayloadAction<Cart[]>) => {
        state.status = 'succeeded';
        updateStateFromCarts(state, action.payload);
    };

    builder
      .addCase(fetchCartItems.pending, handlePending)
      .addCase(fetchCartItems.fulfilled, handleFulfilled)
      .addCase(fetchCartItems.rejected, handleRejected)
      
      .addCase(fetchCartCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.totalQuantity = action.payload;
      })

      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)

      .addCase(updateItemQuantity.pending, handlePending)
      .addCase(updateItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateItemQuantity.rejected, handleRejected)

      .addCase(removeItemFromCart.pending, handlePending)
      .addCase(removeItemFromCart.fulfilled, handleFulfilled)
      .addCase(removeItemFromCart.rejected, handleRejected)

      .addCase(clearCartByStore.pending, handlePending)
      .addCase(clearCartByStore.fulfilled, handleFulfilled)
      .addCase(clearCartByStore.rejected, handleRejected);
  },
});

export const { clearCartOnLogout } = cartSlice.actions;
export default cartSlice.reducer;
