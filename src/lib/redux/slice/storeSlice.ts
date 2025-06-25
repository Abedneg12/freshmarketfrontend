import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { StoreRecommendation } from "@/lib/interface/store";

interface StoreState {
  data: StoreRecommendation[];
  loading: boolean;
  error?: string;
}

const initialState: StoreState = {
  data: [],
  loading: false,
};

export const fetchRecommendations = createAsyncThunk(
  "store/fetchRecommendations",
  async ({ lat, lng }: { lat: number; lng: number }, thunkAPI) => {
    try {
      const response = await axios.get<StoreRecommendation[]>(
        `http://localhost:8000/api/stores/recommendations?lat=${lat}&lng=${lng}`
      );
      return response.data as StoreRecommendation[];
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
      });
  },
});

export default storeSlice.reducer;
