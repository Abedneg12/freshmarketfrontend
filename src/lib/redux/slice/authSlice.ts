import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import {
  AuthState,
  IUser,
  ILoginResponse,
  IErrorResponse,
  IGetProfileResponse,
  IMessageError,
  IMessageResponse,
} from "@/lib/interface/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    registerData: { fullName: string; email: string; referralCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<IMessageError>(
        "/auth/register",
        registerData
      );
      return response.data.message;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Registrasi Gagal.");
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (
    verifyData: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<IMessageError>(
        "/auth/verify-email",
        verifyData
      );
      return response.data.message;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Verifikasi gagal.");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestReset",
  async (emailData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<IMessageError>(
        "/auth/reset-password",
        emailData
      );
      return response.data.message;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal meminta reset password.");
    }
  }
);

export const confirmResetPassword = createAsyncThunk(
  "auth/confirmReset",
  async (
    resetData: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<IMessageError>(
        "/auth/reset-password/confirm",
        resetData
      );
      return response.data.message;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal mereset password.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    LoginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<ILoginResponse>("/auth/login", LoginData);
      localStorage.setItem("token", response.data.token);
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
      const response = await api.get<IGetProfileResponse>("/users/profile");
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
      const response = await api.patch<IGetProfileResponse>(
        "/users/profile",
        data
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
      const response = await api.patch<IGetProfileResponse>(
        "/users/profile/picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (emailData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<IMessageResponse>(
        "/auth/resend-verification",
        emailData
      );
      return response.data.message;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal mengirim ulang email verifikasi.");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData: any, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/change-password", passwordData);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        return rejectWithValue((error.response.data as IErrorResponse).error);
      }
      return rejectWithValue("Gagal mengubah password.");
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
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
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
        (state, action: PayloadAction<{ token: string }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmResetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.isLoading = false;
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
          state.user = action.payload;
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
          state.user = action.payload;
        }
      )
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
