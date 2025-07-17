import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slice/nearestStoreSlice";
import locationReducer from "./slice/locationSlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import addressReducer from "./slice/addressSlice";
import orderReducer from "./slice/orderSlice";
import productReducer from "./slice/orderSlice";
import storeProductReducer from "./slice/storeProductSlice";

export const store = configureStore({
  reducer: {
    store: storeReducer,
    location: locationReducer,
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    product: productReducer,
    storeProduct: storeProductReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;