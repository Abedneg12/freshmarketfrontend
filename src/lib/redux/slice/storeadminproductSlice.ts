import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';


interface IStockInfo {
    quantity: number;
    storeId: number;
}

interface IAdminProduct {
    id: number;
    name: string;
    basePrice: number;
    images: { imageUrl: string }[];
    category: { name: string };
    stocks: IStockInfo[]; 
}

interface IPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface IAdminProductsResponse {
    data: IAdminProduct[];
    pagination: IPagination;
}

interface IAdminProductState {
    products: IAdminProduct[];
    pagination: IPagination | null;
    loading: boolean;
    error: string | null;
}

const initialState: IAdminProductState = {
    products: [],
    pagination: null,
    loading: false,
    error: null,
};

// --- Async Thunks ---

// Thunk untuk mengambil daftar produk (katalog) untuk Store Admin
export const fetchAdminProducts = createAsyncThunk<
    IAdminProductsResponse,
    { page?: number; limit?: number; category?: string; search?: string },
    { state: RootState }
>(
    'adminProducts/fetchProducts',
    async (filters, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            // Endpoint ini harus sesuai dengan yang Anda daftarkan di index.ts untuk product.admin.router.ts
            const response = await axios.get<IAdminProductsResponse>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/products`, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data produk admin.');
        }
    }
);

// --- SLICE ---

const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action: PayloadAction<IAdminProductsResponse>) => {
                state.loading = false;
                state.products = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default adminProductSlice.reducer;
