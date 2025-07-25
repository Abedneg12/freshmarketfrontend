import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/lib/interface/auth";
import { apiUrl } from "@/pages/config";
import axios from "axios";

const initialState: IUser = {
  loading: true,
  id: 0,
  fullName: "",
  email: "",
  profilePicture: undefined,
  referralCode: undefined,
  isVerified: false,
  role: "USER",
  error: null,
  provider: "local",
  hashPassword: "",
};

// Async thunk untuk mengambil data profil dari backend
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token tidak ditemukan");
      }
      const response = await axios.get(`${apiUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data as { data: IUser };
      return data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Gagal mengambil profil"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
