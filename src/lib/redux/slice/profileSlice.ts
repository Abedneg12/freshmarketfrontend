import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/lib/interface/auth";

// Async thunk untuk mengambil data profil dari backend
export const fetchProfile = createAsyncThunk(
  "Profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengambil profil");
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Gagal mengambil profil");
    }
  }
);

const initialState: IUser = {
  loading: false,
  data: null,
  error: null,
};

const ProfileSlice = createSlice({
  name: "customerProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<IUser["data"]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ProfileSlice.reducer;
