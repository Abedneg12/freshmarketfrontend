import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Store } from "@/lib/interface/store.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface PaginatedStoresResponse {
  data: Store[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStores: number;
  };
}

interface AdminStoresState {
  stores: Store[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalStores: number;
}

const initialState: AdminStoresState = {
  stores: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalStores: 0,
};

export const fetchAllStores = createAsyncThunk<
  PaginatedStoresResponse,
  { page?: number; limit?: number }
>(
  "adminStores/fetchAllStores",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<PaginatedStoresResponse>(
        `${apiUrl}/api/management/stores`,
        {
          params: { page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createNewStore = createAsyncThunk<Store, Omit<Store, "id">>(
  "adminStores/createNewStore",
  async (storeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<Store>(
        `${apiUrl}/api/management/stores`,
        storeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateStore = createAsyncThunk<
  Store,
  Partial<Store> & { id: number }
>("adminStores/updateStore", async (storeData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { id, ...data } = storeData;
    const response = await axios.put<Store>(
      `${apiUrl}/api/management/stores/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteStore = createAsyncThunk<number, number>(
  "adminStores/deleteStore",
  async (storeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/management/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return storeId;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const adminStoreSlice = createSlice({
  name: "adminStores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalStores = action.payload.pagination.totalStores;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Gagal mengambil data toko.";
      })
      .addCase(
        createNewStore.fulfilled,
        (state, action: PayloadAction<Store>) => {}
      )
      .addCase(updateStore.fulfilled, (state, action: PayloadAction<Store>) => {
        const index = state.stores.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(
        deleteStore.fulfilled,
        (state, action: PayloadAction<number>) => {}
      );
  },
});

export default adminStoreSlice.reducer;
