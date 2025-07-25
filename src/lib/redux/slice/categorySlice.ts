import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "@/lib/interface/category.type";

interface CategoryState {
  data: Category[];
  loading: boolean;
  error?: string;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
};

export const fetchCategory = createAsyncThunk(
  "category/",
  async (_, thunkAPI) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/category`;
      const response = await axios.get<Category[]>(url);
      return response.data as Category[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Gagal mengambil data kategori"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchCategory.fulfilled,
        (state, action: PayloadAction<CategoryState["data"]>) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;