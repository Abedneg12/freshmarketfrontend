import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Product } from '@/lib/interface/product.type';

// --- State Type ---
interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
};


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Async Thunk to Fetch Products ---
export const fetchProducts = createAsyncThunk<Product[], void, { state: RootState }>(
  'product/fetchProducts',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<Product[]>(`${API_BASE_URL}/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// --- Slice ---
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;