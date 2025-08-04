import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// --- Type Definitions ---
export type OrderStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'PROCESSED'
  | 'SHIPPED'
  | 'CONFIRMED'
  | 'CANCELED';

export interface IProductImage {
  id: number;
  imageUrl: string;
}
export interface IOrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    images: IProductImage[];
  };
  quantity: number;
  price: number;
}
export interface IAddress {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
}
export interface IPaymentProof {
  id: number;
  imageUrl: string;
  uploadedAt: string;
}

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
}

export interface IAdminOrderDetail extends IAdminOrder {
  items: IOrderItem[];
  address: IAddress;
  paymentProof: IPaymentProof | null;
  // Tambahkan statusLogs, voucher, dsb jika butuh
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

  // Untuk detail order
  selectedOrder: IAdminOrderDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: IAdminOrderState = {
  orders: [],
  pagination: null,
  loading: false,
  error: null,

  actionLoading: false,
  actionError: null,
  actionSuccess: null,

  selectedOrder: null,
  detailLoading: false,
  detailError: null,
};

// --- Thunk: Get Orders (list) ---
type AdminOrderFilters = {
  page?: number;
  limit?: number;
  status?: OrderStatus | string;
  storeId?: number;
  orderId?: number;
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

// --- Thunk: Fetch Detail Order ---
export const fetchAdminOrderDetail = createAsyncThunk<
  IAdminOrderDetail,
  number, // orderId
  { state: RootState }
>(
  'adminOrders/fetchOrderDetail',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.get<{ data: IAdminOrderDetail }>(
        `${API_URL}/api/admin/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal mengambil detail pesanan.';
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
      const response = await axios.post<{ data: IAdminOrder }>(
        `${API_URL}/api/admin/orders/${orderId}/confirm`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
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
      const response = await axios.post<{ data: IAdminOrder }>(
        `${API_URL}/api/admin/orders/${orderId}/ship`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
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
      const response = await axios.post<{ data: IAdminOrder }>(
        `${API_URL}/api/admin/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
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

      state.selectedOrder = null;
      state.detailLoading = false;
      state.detailError = null;
    },
    clearAdminOrderActionStatus: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = null;
    },
    resetAdminOrderDetail: (state) => {
      state.selectedOrder = null;
      state.detailLoading = false;
      state.detailError = null;
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

    // Fetch Order Detail
    builder
      .addCase(fetchAdminOrderDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedOrder = null;
      })
      .addCase(fetchAdminOrderDetail.fulfilled, (state, action: PayloadAction<IAdminOrderDetail>) => {
        state.detailLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = (action.payload as string) || 'Gagal mengambil detail pesanan.';
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
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        // Update juga selectedOrder jika sesuai
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = { ...state.selectedOrder, ...action.payload };
        }
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
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = { ...state.selectedOrder, ...action.payload };
        }
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
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = { ...state.selectedOrder, ...action.payload };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = (action.payload as string) || 'Gagal membatalkan pesanan.';
      });
  },
});

export const { 
  clearAdminOrders, 
  clearAdminOrderActionStatus, 
  resetAdminOrderDetail 
} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
