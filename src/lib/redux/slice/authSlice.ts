import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/lib/interface/auth";

interface AuthState {
  user: IUser | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.isLogin = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logoutAction: (state) => {
      state.user = null;
      state.isLogin = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    setUserFromToken: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLogin = true;
    },
  },
});

export const { loginAction, logoutAction, setUserFromToken } =
  authSlice.actions;
export default authSlice.reducer;
