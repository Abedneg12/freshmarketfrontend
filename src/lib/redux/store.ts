import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import authReducer from "./features/authSlices";
import eventReducer from "./features/eventSlices";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Create a noop storage for server-side rendering (SSR)
const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Use localStorage for the client, noop for SSR
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

// Combine reducers, applying persist only to `auth`
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  event: eventReducer,
});

// Create the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist to work
    }),
});

// Create the persistor
export const persistor: Persistor = persistStore(store);

// Types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
