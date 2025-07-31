import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slice/nearestStoreSlice";
import locationReducer from "./slice/locationSlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import addressReducer from "./slice/addressSlice";
import orderReducer from "./slice/orderSlice";
import adminStoreReducer from "./slice/adminStoreSlice";
import productReducer from "./slice/orderSlice";
import storeProductReducer from "./slice/storeProductSlice";
import ProfileReducer from "./slice/profileSlice";
import CategoryReducer from "./slice/categorySlice";
import MarketReducer from "./slice/storeSlice";
import adminrodersReducer from "./slice/adminorderslice";
import adminProductreducer from "./slice/storeadminproductSlice";
import StoreAdminDashboardreducer from "./slice/storeadminDashboardSlice";


export const store = configureStore({
  reducer: {
    store: storeReducer,
    location: locationReducer,
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    adminStores: adminStoreReducer,
    product: productReducer,
    storeProduct: storeProductReducer,
    profile: ProfileReducer,
    category: CategoryReducer,
    Market: MarketReducer,
    adminorders: adminrodersReducer, 
    adminProducts: adminProductreducer,
    storeAdminDashboard: StoreAdminDashboardreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
