import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Market } from "@/lib/interface/market";

interface StoreState {
  data: Market[];
  loading: boolean;
  error?: string;
}

const initialState: StoreState = {
  data: [],
  loading: false,
};

export const fetchMarket = createAsyncThunk(
  "stores/all",
  async (_, thunkAPI) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/all`;
      const response = await axios.get<Market[]>(url);
      return response.data as Market[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Gagal mengambil data toko"
      );
    }
  }
);

const marketSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarket.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchMarket.fulfilled,
        (state, action: PayloadAction<StoreState["data"]>) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchMarket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default marketSlice.reducer;