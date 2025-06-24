import storage from "redux-persist/lib/storage";  // default to localStorage for client
import memoryStorage from "redux-persist/es/storage";  // Use memory storage for SSR

export const persistConfig = {
  key: "root",
  storage: typeof window !== "undefined" ? storage : memoryStorage,  // Use memoryStorage if SSR
  whitelist: ["auth"],
};
