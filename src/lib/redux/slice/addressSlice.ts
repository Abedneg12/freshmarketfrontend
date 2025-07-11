import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IAddress } from "@/lib/interface/address";
import build from "next/dist/build";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddressState {
  addresses: IAddress[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk<IAddress[]>(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as IAddress[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil alamat."
      );
    }
  }
);

export const createAddress = createAsyncThunk<
  IAddress,
  Omit<IAddress, "id" | "latitude" | "longitude">
>("address/create", async (addressData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/addresses`, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as IAddress;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error);
  }
});

export const updateAddress = createAsyncThunk<
  IAddress,
  Partial<IAddress> & { id: number }
>("address/update", async (addressData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { id, ...data } = addressData;
    const response = await axios.put(`${API_URL}/api/addresses/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as IAddress;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error);
  }
});

export const deleteAddress = createAsyncThunk<number, number>(
  "address/delete",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const setMainAddress = createAsyncThunk<IAddress, number>(
  "address/setMain",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/api/addresses/${addressId}/set-main`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as IAddress;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<IAddress[]>) => {
          state.loading = false;
          state.addresses = action.payload;
        }
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) state.addresses[index] = action.payload;
      })
      .addCase(setMainAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((a) => ({
          ...a,
          isMain: a.id === action.payload.id,
        }));
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export default addressSlice.reducer;
