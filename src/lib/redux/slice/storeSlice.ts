import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Market, StoreRecommendation } from "@/lib/interface/market";

interface StoreState {
  data: Market[];
  loading: boolean;
  error?: string;
}

const initialState: StoreState = {
  data: [],
  loading: false,
};

export const fetchRecommendations = createAsyncThunk(
  "store/fetchRecommendations",
  async (location: { lat: number; lng: number } | undefined, thunkAPI) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/stores/recommendations`;

      if (location?.lat && location?.lng) {
        url += `?lat=${location.lat}&lng=${location.lng}`;
      }

      const response = await axios.get<Market[]>(url);
      return response.data as Market[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Gagal mengambil data toko"
      );
    }
  }
);

export const fetchStore = createAsyncThunk(
  "stores/all",
  async (_, thunkAPI) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/stores/all`;
      const response = await axios.get<Market[]>(url);
      return response.data as Market[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Gagal mengambil data toko"
      );
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRecommendations.fulfilled,
        (state, action: PayloadAction<StoreState["data"]>) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStore.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchStore.fulfilled,
        (state, action: PayloadAction<StoreState["data"]>) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default storeSlice.reducer;
