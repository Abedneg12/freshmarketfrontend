import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

type OrderStatus = 'PROCESSED' | 'SHIPPED' | 'CONFIRMED' | 'CANCELED' | 'WAITING_CONFIRMATION';

interface IAdminOrder {
    id: number;
    user: {
        fullName: string;
    };
    createdAt: string;
    totalPrice: number;
    status: OrderStatus;
    store: {
        name: string;
    };
}

interface IPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface IAdminOrdersResponse {
    data: IAdminOrder[];
    pagination: IPagination;
}

interface IAdminOrderState {
    orders: IAdminOrder[];
    pagination: IPagination | null;
    loading: boolean;
    error: string | null;
}

const initialState: IAdminOrderState = {
    orders: [],
    pagination: null,
    loading: false,
    error: null,
};

// --- Async Thunks ---

// Thunk untuk mengambil daftar pesanan untuk admin
export const fetchAdminOrders = createAsyncThunk<
    IAdminOrdersResponse,
    { page?: number; limit?: number; status?: string; search?: string },
    { state: RootState }
>(
    'adminOrders/fetchOrders',
    async (filters, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            // [DIUBAH] Menggunakan process.env.NEXT_PUBLIC_API_URL secara langsung
            const response = await axios.get<IAdminOrdersResponse>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters, // Kirim filter sebagai query params
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data pesanan.');
        }
    }
);

// --- SLICE ---

const adminOrderSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action: PayloadAction<IAdminOrdersResponse>) => {
                state.loading = false;
                state.orders = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default adminOrderSlice.reducer;
