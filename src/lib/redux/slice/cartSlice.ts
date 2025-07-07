// src/redux/slice/cartSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; // Import RootState untuk akses token

// Tentukan tipe data untuk item produk (bisa disesuaikan)
interface Product {
  id: number;
  name: string;
  basePrice: number;
  images: { imageUrl: string }[];
}

// Tentukan tipe data untuk item di keranjang
interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

// Tentukan bentuk state untuk slice ini
interface CartState {
  items: CartItem[];
  totalQuantity: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  status: 'idle',
  error: null,
};

// Ambil Base URL dari environment variable untuk fleksibilitas
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =======================================================================
// ASYNC THUNKS (Untuk Komunikasi dengan API Backend)
// =======================================================================

// Thunk untuk mengambil jumlah total item di keranjang
export const fetchCartCount = createAsyncThunk<number, void, { state: RootState }>(
  'cart/fetchCount',
  async (_, { getState }) => {
    // Asumsi token disimpan di authSlice
    const token = getState().auth.token; 
    const response = await axios.get(`${API_BASE_URL}/api/cart/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return (response.data as { count: number }).count;
  }
);

// Thunk untuk menambah item ke keranjang
export const addItemToCart = createAsyncThunk<any, { productId: number; storeId: number; quantity: number }, { state: RootState }>(
  'cart/addItem',
  async (item, { dispatch, getState }) => {
    const token = getState().auth.token;
    const response = await axios.post(`${API_BASE_URL}/api/cart`, item, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Setelah berhasil menambah item, panggil ulang fetchCartCount untuk update jumlah
    dispatch(fetchCartCount());
    return response.data;
  }
);

// Anda bisa menambahkan thunk lain di sini untuk removeItem, updateQuantity, dll.

// =======================================================================
// SLICE
// =======================================================================

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer untuk membersihkan data cart saat pengguna logout
    clearCartOnLogout: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Kasus untuk fetchCartCount
      .addCase(fetchCartCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.totalQuantity = action.payload;
      })
      .addCase(fetchCartCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Gagal mengambil data keranjang';
      })
      // Kasus untuk addItemToCart
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.status = 'succeeded';
        // Tidak perlu update manual, karena fetchCartCount sudah dipanggil
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Gagal menambah item';
      });
  },
});

export const { clearCartOnLogout } = cartSlice.actions;
export default cartSlice.reducer;