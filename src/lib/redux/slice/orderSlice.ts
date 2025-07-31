import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface IAddress {
    id: number;
    label: string;
    recipient: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
}

interface IOrder {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: { 
      product: { 
          name: string;
          images: { imageUrl: string }[]; 
      };
      quantity: number;
      price: number;
  }[];
  address?: IAddress; 
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

interface IApiBaseResponse<T> {
    message?: string;
    data: T;
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
  const response = await axios.post<IApiBaseResponse<IOrderResponse>>(
    `${API_BASE_URL}/api/orders`,
    orderData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data;
});


export const fetchUserOrders = createAsyncThunk<
  IOrderListResponse,
  { page?: number; status?: string },
  { state: RootState }
>('order/fetchUserOrders', async (filters, { getState }) => {
  const token = getState().auth.token;
  const response = await axios.get<IOrderListResponse>(`${API_BASE_URL}/api/orders/my`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  });
  return response.data;
});


export const fetchOrderById = createAsyncThunk<IOrder, number, { state: RootState }>(
  'order/fetchById',
  async (orderId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get<IApiBaseResponse<IOrder>>(`${API_BASE_URL}/api/orders/my/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
);


export const uploadPaymentProof = createAsyncThunk<IOrder, { orderId: number; proofFile: File }, { state: RootState }>(
  'order/uploadProof',
  async ({ orderId, proofFile }, { getState }) => {
    const token = getState().auth.token;
    const formData = new FormData();
    formData.append('paymentProof', proofFile);

    const response = await axios.post<IApiBaseResponse<IOrder>>(
      `${API_BASE_URL}/api/orders/${orderId}/payment-proof`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
);


export const cancelOrderByUser = createAsyncThunk<IOrder, number, { state: RootState }>(
  'order/cancelByUser',
  async (orderId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.post<IApiBaseResponse<IOrder>>(
      `${API_BASE_URL}/api/orders/my/${orderId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
);


export const confirmOrderReceived = createAsyncThunk<IOrder, number, { state: RootState }>(
  'order/confirmReceived',
  async (orderId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.post<IApiBaseResponse<IOrder>>(
      `${API_BASE_URL}/api/orders/my/${orderId}/confirm`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
);


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
    const handlePending = (state: OrderState) => { state.status = 'loading'; state.error = null; };
    const handleRejected = (state: OrderState, action: any) => {
      state.status = 'failed';
      state.error = action.error.message || 'Terjadi kesalahan pada pesanan.';
    };

    builder
      .addCase(createOrder.pending, handlePending)
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
        state.status = 'succeeded';
        state.lastOrderResponse = action.payload;
      })
      .addCase(createOrder.rejected, handleRejected)

      .addCase(fetchUserOrders.pending, handlePending)
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<IOrderListResponse>) => {
        state.status = 'succeeded';
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserOrders.rejected, handleRejected)


      .addCase(fetchOrderById.pending, handlePending)
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<IOrder>) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, handleRejected)

      .addMatcher(
        (action) =>
          [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(
            (thunk) => thunk.fulfilled.match(action)
          ),
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
        (action) =>
          [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(
            (thunk) => thunk.pending.match(action)
          ),
        handlePending
      )

      .addMatcher(
        (action) =>
          [uploadPaymentProof, cancelOrderByUser, confirmOrderReceived].some(
            (thunk) => thunk.rejected.match(action)
          ),
        handleRejected
      );
  },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
