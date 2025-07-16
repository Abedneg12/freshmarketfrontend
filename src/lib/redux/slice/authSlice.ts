import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthState,
  IUser,
  ILoginResponse,
  IErrorResponse,
  IGetProfileResponse,
  ILogin,
} from "@/lib/interface/auth";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<ILoginResponse, ILogin>(
  "auth/login",
  async (LoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post<ILoginResponse>(
        `${API_URL}/api/auth/login`,
        LoginData
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
        Cookies.set("auth_token", response.data.token, {
          expiresin: "7d",
          path: "/",
        });
      }
      dispatch(fetchUserProfile());
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Terjadi kesalahan yang tidak diketahui.");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token tidak diketahui.");
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get<IGetProfileResponse>(
        `${API_URL}/api/user/profile`,
        config
      );
      return response.data.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal mengambil data profil.");
    }
  }
);

export const updateProfileName = createAsyncThunk(
  "auth/updateName",
  async (data: { fullName: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token tidak diketahui.");
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch<IGetProfileResponse>(
        `${API_URL}/api/user/profile`,
        data,
        config
      );
      return response.data.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal memperbarui nama.");
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "auth/updatePicture",
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token tidak ditemukan.");
      }
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch<IGetProfileResponse>(
        `${API_URL}/api/user/profile/picture`,
        formData,
        config
      );
      return response.data.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal mengunggah foto.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
      Cookies.set("auth_token", action.payload, { expires: 1, path: "/" });
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      Cookies.remove("auth_token", { path: "/" });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<ILoginResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      .addCase(updateProfileName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProfileName.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          if (state.user) {
            state.user.fullName = action.payload.fullName;
          }
        }
      )
      .addCase(updateProfileName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProfilePicture.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          if (state.user) {
            state.user.profilePicture = action.payload.profilePicture;
          }
        }
      )
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;