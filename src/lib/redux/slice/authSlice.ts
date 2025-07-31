// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IUser } from "@/lib/interface/auth";

// interface AuthState {
//   user: IUser | null;
//   isAuthenticated: boolean;
//   token: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginAction: (
//       state,
//       action: PayloadAction<{ user: IUser; token: string }>
//     ) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       if (typeof window !== "undefined") {
//         localStorage.setItem("token", action.payload.token);
//       }
//     },
//     logoutAction: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token");
//       }
//     },
//     setUserFromToken: (state, action: PayloadAction<IUser>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//   },
// });

// export const { loginAction, logoutAction, setUserFromToken } =
//   authSlice.actions;
// export default authSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/lib/interface/auth";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    setUserFromToken: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { loginAction, logoutAction, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
