import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  coordinates: { lat: number; lng: number } | null;
  permission: "idle" | "granted" | "denied";
  error: string | null;
}

const initialState: LocationState = {
  coordinates: null,
  permission: "idle",
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationSuccess: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>
    ) => {
      state.coordinates = action.payload;
      state.permission = "granted";
      state.error = null;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.coordinates = null;
      state.permission = "denied";
      state.error = action.payload;
    },
  },
});

export const { setLocationSuccess, setLocationError } = locationSlice.actions;

export default locationSlice.reducer;
