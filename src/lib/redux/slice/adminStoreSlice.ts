import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "@/pages/config";
import { Store } from "@/lib/interface/store.type";

interface AdminStoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminStoreState = {
  stores: [],
  loading: false,
  error: null,
};

type CreateStorePayload = Omit<Store, "id">;

type UpdateStorePayload = Partial<Omit<Store, "id">> & { id: number };

export const fetchAllStores = createAsyncThunk(
  "adminStores/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/management/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as Store[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data toko."
      );
    }
  }
);

export const createNewStore = createAsyncThunk(
  "adminStores/createNew",
  async (storeData: CreateStorePayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/management/stores`,
        storeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as Store;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal membuat toko baru."
      );
    }
  }
);

export const updateStore = createAsyncThunk(
  "adminStores/update",
  async (storeData: UpdateStorePayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { id, ...data } = storeData;
      const response = await axios.put(
        `${apiUrl}/api/management/stores/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as Store;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memperbarui toko."
      );
    }
  }
);

export const deleteStore = createAsyncThunk(
  "adminStores/delete",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/management/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return storeId; // Kembalikan ID toko yang dihapus
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal menghapus toko."
      );
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
        state.stores = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewStore.fulfilled, (state, action) => {
        state.stores.push(action.payload);
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = { ...state.stores[index], ...action.payload };
        }
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.stores = state.stores.filter(
          (store) => store.id !== action.payload
        );
      })
      .addMatcher(
        (action) =>
          [
            createNewStore.pending,
            updateStore.pending,
            deleteStore.pending,
          ].some((thunk) => thunk.match(action)),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            createNewStore.rejected,
            updateStore.rejected,
            deleteStore.rejected,
          ].some((thunk) => thunk.match(action)),
        (state, action) => {
          state.loading = false;
          state.error = (action as PayloadAction<string>).payload;
        }
      );
  },
});

export default adminStoreSlice.reducer;
