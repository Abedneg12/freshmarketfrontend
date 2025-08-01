import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// --- Type Definition (samakan dengan backend mu)
export type OrderStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'PROCESSED'
  | 'SHIPPED'
  | 'CONFIRMED'
  | 'CANCELED';

export interface IAdminOrder {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  store: {
    id: number;
    name: string;
  };
  // ... Tambah relasi lain jika perlu (address, items, dst)
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminOrdersResponse {
  data: IAdminOrder[];
  pagination: IPagination;
}

interface IAdminOrderState {
  orders: IAdminOrder[];
  pagination: IPagination | null;
  loading: boolean;
  error: string | null;

  // untuk aksi spesifik pada 1 order
  actionLoading: boolean;
  actionError: string | null;
  actionSuccess: string | null;
}

const initialState: IAdminOrderState = {
  orders: [],
  pagination: null,
  loading: false,
  error: null,

  actionLoading: false,
  actionError: null,
  actionSuccess: null,
};

// --- Thunk: Get Orders (sudah ada) ---
type AdminOrderFilters = {
  page?: number;
  limit?: number;
  status?: OrderStatus | string;
  storeId?: number;
  orderId?: number;
  // filter lain sesuai kebutuhan
};

export const fetchAdminOrders = createAsyncThunk<
  IAdminOrdersResponse,
  AdminOrderFilters,
  { state: RootState }
>(
  'adminOrders/fetchOrders',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.get<IAdminOrdersResponse>(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal mengambil data pesanan.';
      return rejectWithValue(msg);
    }
  }
);

// --- Thunk: Confirm Payment ---
export const confirmPayment = createAsyncThunk<
  IAdminOrder,
  { orderId: number; decision: 'APPROVE' | 'REJECT' },
  { state: RootState }
>(
  'adminOrders/confirmPayment',
  async ({ orderId, decision }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post<IAdminOrder>(
        `${API_URL}/api/admin/orders/${orderId}/confirm`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal konfirmasi pembayaran.';
      return rejectWithValue(msg);
    }
  }
);

// --- Thunk: Ship Order ---
export const shipOrder = createAsyncThunk<
  IAdminOrder,
  { orderId: number },
  { state: RootState }
>(
  'adminOrders/shipOrder',
  async ({ orderId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post<IAdminOrder>(
        `${API_URL}/api/admin/orders/${orderId}/ship`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal mengirim pesanan.';
      return rejectWithValue(msg);
    }
  }
);

// --- Thunk: Cancel Order ---
export const cancelOrder = createAsyncThunk<
  IAdminOrder,
  { orderId: number },
  { state: RootState }
>(
  'adminOrders/cancelOrder',
  async ({ orderId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post<IAdminOrder>(
        `${API_URL}/api/admin/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal membatalkan pesanan.';
      return rejectWithValue(msg);
    }
  }
);

// --- Slice ---
const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    clearAdminOrders: (state) => {
      state.orders = [];
      state.pagination = null;
      state.error = null;
      state.loading = false;

      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = null;
    },
    clearAdminOrderActionStatus: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
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
        state.error = (action.payload as string) || 'Gagal mengambil data pesanan.';
      });

    // Confirm Payment
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action: PayloadAction<IAdminOrder>) => {
        state.actionLoading = false;
        state.actionSuccess = 'Konfirmasi pembayaran berhasil!';
        // update order di state.orders
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = (action.payload as string) || 'Gagal konfirmasi pembayaran.';
      });

    // Ship Order
    builder
      .addCase(shipOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = null;
      })
      .addCase(shipOrder.fulfilled, (state, action: PayloadAction<IAdminOrder>) => {
        state.actionLoading = false;
        state.actionSuccess = 'Pesanan berhasil dikirim!';
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(shipOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = (action.payload as string) || 'Gagal mengirim pesanan.';
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<IAdminOrder>) => {
        state.actionLoading = false;
        state.actionSuccess = 'Pesanan berhasil dibatalkan!';
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = (action.payload as string) || 'Gagal membatalkan pesanan.';
      });
  },
});

export const { clearAdminOrders, clearAdminOrderActionStatus } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
