// // src/redux/slice/cartSlice.ts

// import {
//   createSlice,
//   createAsyncThunk,
//   PayloadAction,
//   createSelector,
// } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../store"; // Import RootState untuk akses token

// // Tentukan tipe data untuk item produk (bisa disesuaikan)
// interface Product {
//   id: number;
//   name: string;
//   basePrice: number;
//   images: { imageUrl: string }[];
// }

// // Tentukan tipe data untuk item di keranjang
// interface CartItem {
//   id: number;
//   quantity: number;
//   product: Product;
// }

// interface Cart {
//   id: number;
//   storeId: number;
//   store: { name: string };
//   items: CartItem[];
// }

// // Tentukan bentuk state untuk slice ini
// interface CartState {
//   carts: Cart[];
//   totalQuantity: number;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: CartState = {
//   carts: [],
//   totalQuantity: 0,
//   status: "idle",
//   error: null,
// };

// // Ambil Base URL dari environment variable untuk fleksibilitas
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// // =======================================================================
// // ASYNC THUNKS (Untuk Komunikasi dengan API Backend)
// // =======================================================================

// // Thunk untuk mengambil jumlah total item di keranjang
// export const fetchCartCount = createAsyncThunk<
//   number,
//   void,
//   { state: RootState }
// >("cart/fetchCount", async (_, { getState }) => {
//   // Asumsi token disimpan di authSlice
//   const token = getState().auth.token;
//   const response = await axios.get(`${API_BASE_URL}/api/cart/count`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return (response.data as { count: number }).count;
// });

// // Thunk untuk menambah item ke keranjang
// export const addItemToCart = createAsyncThunk<
//   any,
//   { productId: number; storeId: number; quantity: number },
//   { state: RootState }
// >("cart/addItem", async (item, { dispatch, getState }) => {
//   const token = getState().auth.token;
//   const response = await axios.post(`${API_BASE_URL}/api/cart`, item, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   // Setelah berhasil menambah item, panggil ulang fetchCartCount untuk update jumlah
//   dispatch(fetchCartCount());
//   return response.data;
// });

// // Thunk baru untuk mengambil isi detail keranjang
// export const fetchCartDetails = createAsyncThunk<
//   Cart[],
//   void,
//   { state: RootState }
// >("cart/fetchDetails", async (_, { getState, rejectWithValue }) => {
//   try {
//     const token = getState().auth.token;
//     const response = await axios.get(`${API_BASE_URL}/cart`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data as Cart[];
//   } catch (error: any) {
//     return rejectWithValue("Gagal mengambil detail keranjang.");
//   }
// });

// // Anda bisa menambahkan thunk lain di sini untuk removeItem, updateQuantity, dll.

// // =======================================================================
// // SLICE
// // =======================================================================

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     // Reducer untuk membersihkan data cart saat pengguna logout
//     clearCartOnLogout: (state) => {
//       state.carts = [];
//       state.totalQuantity = 0;
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Kasus untuk fetchCartCount
//       .addCase(fetchCartCount.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchCartCount.fulfilled,
//         (state, action: PayloadAction<number>) => {
//           state.status = "succeeded";
//           state.totalQuantity = action.payload;
//         }
//       )
//       .addCase(fetchCartCount.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Gagal mengambil data keranjang";
//       })
//       // Kasus untuk addItemToCart
//       .addCase(addItemToCart.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(addItemToCart.fulfilled, (state) => {
//         state.status = "succeeded";
//         // Tidak perlu update manual, karena fetchCartCount sudah dipanggil
//       })
//       .addCase(addItemToCart.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Gagal menambah item";
//       })
//       .addCase(fetchCartDetails.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchCartDetails.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.carts = action.payload;
//         state.totalQuantity = action.payload.reduce(
//           (sum, cart) =>
//             sum +
//             cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
//           0
//         );
//       })
//       .addCase(fetchCartDetails.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// // Selector untuk menghitung subtotal dari semua item di keranjang.
// export const selectCartSubtotal = createSelector(
//   (state: RootState) => state.cart.carts,
//   (carts) =>
//     carts.reduce(
//       (total, cart) =>
//         total +
//         cart.items.reduce(
//           (subtotal, item) => subtotal + item.quantity * item.product.basePrice,
//           0
//         ),
//       0
//     )
// );

// export const { clearCartOnLogout } = cartSlice.actions;
// export default cartSlice.reducer;


// src/lib/redux/slice/cartSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// --- Tipe Data ---
// Sebaiknya tipe-tipe ini berada di file interface terpusat
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

// Backend Anda mengembalikan array dari Cart, di mana setiap cart mewakili satu toko
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
  carts: Cart[]; // Mengganti 'items' menjadi 'carts' agar sesuai struktur data
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



// --- Async Thunks (Sesuai dengan Router Backend) ---

// GET /api/cart -> Mengambil semua item di keranjang
export const fetchCartItems = createAsyncThunk<Cart[], void, { state: RootState }>(
  'cart/fetchItems',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// GET /api/cart/count -> Mengambil jumlah total item untuk notifikasi navbar
export const fetchCartCount = createAsyncThunk<number, void, { state: RootState }>(
  'cart/fetchCount',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<{ count: number }>(`${process.env.NEXT_PUBLIC_API_URL}/cart/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.count;
  }
);

// POST /api/cart/add -> Menambah item baru ke keranjang
export const addItemToCart = createAsyncThunk<Cart[], { productId: number; storeId: number; quantity: number }, { state: RootState }>(
  'cart/addItem',
  async (item, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.post<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, item, {
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
    const response = await axios.patch<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// DELETE /api/cart/items/:itemId -> Menghapus satu item dari keranjang
export const removeItemFromCart = createAsyncThunk<Cart[], number, { state: RootState }>(
  'cart/removeItem',
  async (itemId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.delete<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
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
        const response = await axios.delete<Cart[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart/stores/${storeId}`, {
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