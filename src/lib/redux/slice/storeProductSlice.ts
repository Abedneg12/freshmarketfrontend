import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { storeProduct } from '@/lib/interface/product.type';

// --- State Type ---
interface StoreProductsState {
  products: storeProduct | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StoreProductsState = {
  products: null,
  status: 'idle',
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Async Thunk to Fetch Products by Store ---
export const fetchStoreProducts = createAsyncThunk<
  storeProduct,
  number, // storeId
  { state: RootState }
>(
  'storeProducts/fetchStoreProducts',
  async (storeId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<storeProduct>(
      `${API_BASE_URL}/stores/${storeId}/products`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

// --- Slice ---
const storeProductsSlice = createSlice({
  name: 'storeProducts',
  initialState,
  reducers: {
    clearStoreProducts: (state) => {
      state.products = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action: PayloadAction<storeProduct>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch store products';
      });
  },
});

export const { clearStoreProducts } = storeProductsSlice.actions;
export default storeProductsSlice.reducer;