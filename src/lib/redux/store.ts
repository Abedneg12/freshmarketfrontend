import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slice/storeSlice";
import locationReducer from "./slice/locationSlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import addressReducer from "./slice/addressSlice";
import orderReducer from "./slice/orderSlice";

export const store = configureStore({
  reducer: {
    store: storeReducer,
    location: locationReducer,
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;