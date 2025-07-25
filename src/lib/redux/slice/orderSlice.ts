// src/lib/redux/slice/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// --- Definisi Tipe Data ---
interface IOrder {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: { product: { name: string } }[];
}

interface IOrderListResponse {
    data: IOrder[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface IOrderResponse {
  order: IOrder;
  midtransRedirectUrl?: string;
}

interface IApiCreateOrderResponse {
    message: string;
    data: IOrderResponse;
}

interface OrderState {
  orders: IOrder[];
  pagination: IOrderListResponse['pagination'] | null;
  currentOrder: IOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastOrderResponse: IOrderResponse | null;
}

const initialState: OrderState = {
  orders: [],
  pagination: null,
  currentOrder: null,
  status: 'idle',
  error: null,
  lastOrderResponse: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// --- Async Thunks (Sesuai dengan Router Backend) ---

// POST /api/orders -> Membuat pesanan baru
export const createOrder = createAsyncThunk<
  IOrderResponse,
  {
    addressId: number;
    paymentMethod: 'BANK_TRANSFER' | 'MIDTRANS';
    voucherCode?: string;
    cartItemIds: number[];
  },
  { state: RootState }
>('order/create', async (orderData, { getState }) => {
  const token = getState().auth.token;
  const response = await axios.post<IApiCreateOrderResponse>(
    `${API_BASE_URL}/api/orders`,
    orderData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data;
});

// GET /api/orders/my -> Mengambil riwayat pesanan pengguna
export const fetchUserOrders = createAsyncThunk<IOrderListResponse, void, { state: RootState }>(
    'order/fetchUserOrders',
    async (_, { getState }) => {
        const token = getState().auth.token;
        const response = await axios.get<IOrderListResponse>(`${API_BASE_URL}/api/orders/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
);

// [DITAMBAHKAN] GET /api/orders/my/:orderId -> Mengambil detail satu pesanan
export const fetchOrderById = createAsyncThunk<IOrder, number, { state: RootState }>(
    'order/fetchById',
    async (orderId, { getState }) => {
        const token = getState().auth.token;
        const response = await axios.get<{ data: IOrder }>(`${API_BASE_URL}/api/orders/my/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    }
);

// POST /api/orders/:orderId/payment-proof -> Mengunggah bukti pembayaran
export const uploadPaymentProof = createAsyncThunk<IOrder, { orderId: number; proofFile: File }, { state: RootState }>(
    'order/uploadProof',
    async ({ orderId, proofFile }, { getState }) => {
        const token = getState().auth.token;
        const formData = new FormData();
        formData.append('paymentProof', proofFile);

        const response = await axios.post<{ data: IOrder }>(
            `${API_BASE_URL}/api/orders/${orderId}/payment-proof`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    }
);

// POST /api/orders/my/:orderId/cancel -> Membatalkan pesanan
export const cancelOrderByUser = createAsyncThunk<IOrder, number, { state: RootState }>(
    'order/cancelByUser',
    async (orderId, { getState }) => {
        const token = getState().auth.token;
        const response = await axios.post<{ data: IOrder }>(
            `${API_BASE_URL}/api/orders/my/${orderId}/cancel`,
            {}, // Body kosong
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    }
);

// POST /api/orders/my/:orderId/confirm -> Mengonfirmasi penerimaan pesanan
export const confirmOrderReceived = createAsyncThunk<IOrder, number, { state: RootState }>(
    'order/confirmReceived',
    async (orderId, { getState }) => {
        const token = getState().auth.token;
        const response = await axios.post<{ data: IOrder }>(
            `${API_BASE_URL}/api/orders/my/${orderId}/confirm`,
            {}, // Body kosong
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    }
);


// --- SLICE ---

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderStatus: (state) => {
        state.status = 'idle';
        state.error = null;
        state.lastOrderResponse = null;
    }
  },
  extraReducers: (builder) => {
    // Helper untuk status pending dan rejected
    const handlePending = (state: OrderState) => { state.status = 'loading'; state.error = null; };
    const handleRejected = (state: OrderState, action: any) => {
        state.status = 'failed';
        state.error = action.error.message || 'Terjadi kesalahan pada pesanan.';
    };

    builder
      // Create Order
      .addCase(createOrder.pending, handlePending)
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
        state.status = 'succeeded';
        state.lastOrderResponse = action.payload;
      })
      .addCase(createOrder.rejected, handleRejected)

      // Fetch User Orders
      .addCase(fetchUserOrders.pending, handlePending)
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<IOrderListResponse>) => {
        state.status = 'succeeded';
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserOrders.rejected, handleRejected)
      
      // [DITAMBAHKAN] Fetch Order By Id
      .addCase(fetchOrderById.pending, handlePending)
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<IOrder>) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, handleRejected)

      .addMatcher(
        (action) => [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(thunk => thunk.fulfilled.match(action)),
        (state, action: PayloadAction<IOrder>) => {
            state.status = 'succeeded';
            const index = state.orders.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
            if (state.currentOrder?.id === action.payload.id) {
                state.currentOrder = action.payload;
            }
        }
      )
      .addMatcher(
        (action) => [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(thunk => thunk.pending.match(action)),
        handlePending
      )
      .addMatcher(
        (action) => [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(thunk => thunk.rejected.match(action)),
        handleRejected
      );
  },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
