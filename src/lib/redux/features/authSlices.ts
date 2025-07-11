// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage'; // LocalStorage or SessionStorage
// import { persistReducer } from 'redux-persist';

// type StatusRole = 'customer' | 'organiser' | null;

// export interface IUser {
//   email: string;
//   first_name: string;
//   last_name: string;
//   id: number;
//   status_role: StatusRole;
//   profile_pict: string;
//   referal_code: string;
//   point: number;
//   is_verified: boolean;
// }

// export interface IAuth {
//   user: IUser;
//   isLogin: boolean;
//   token: string | null;
// }

// const initialState: IAuth = {
//   user: {
//     email: '',
//     first_name: '',
//     last_name: '',
//     id: 0,
//     status_role: null,
//     profile_pict: '',
//     referal_code: '',
//     point: 0,
//     is_verified: false,
//   },
//   isLogin: false,
//   token: null,
// };

// const persistConfig = {
//   key: 'auth',
//   storage, 
//   whitelist: ['user', 'token'],
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     onLogin: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
//       state.user = action.payload.user;
//       state.isLogin = true;
//       state.token = action.payload.token;
//     },
//     onLogout: (state) => {
//       state.user = initialState.user;
//       state.isLogin = false;
//       state.token = null;
//     },
//     updateToken: (state, action: PayloadAction<string>) => {
//       state.token = action.payload;
//     },
//     restoreLogin: (state, action: PayloadAction<IAuth>) => {
//       const { user, isLogin, token } = action.payload;
//       if (user && token) {
//         state.user = user;
//         state.isLogin = isLogin;
//         state.token = token;
//       }
//     },
//   },
// });

// const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

// export const { onLogin, onLogout, updateToken, restoreLogin } = authSlice.actions;

// export default persistedAuthReducer;
