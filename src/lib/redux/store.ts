import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slice/storeSlice";
import locationReducer from "./slice/locationSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    store: storeReducer,
    location: locationReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
