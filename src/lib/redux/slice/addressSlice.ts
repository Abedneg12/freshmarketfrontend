import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IAddress } from "@/lib/interface/address";
import { apiUrl } from "@/pages/config";

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

export const fetchAddresses = createAsyncThunk<IAddress[], void>(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<IAddress[]>(`${apiUrl}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil alamat."
      );
    }
  }
);

export const createAddress = createAsyncThunk<
  IAddress,
  Omit<IAddress, "id" | "latitude" | "longitude">,
  { rejectValue: string }
>("address/createAddress", async (addressData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/api/addresses`, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as IAddress;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Gagal membuat alamat."
    );
  }
});

export const updateAddress = createAsyncThunk<
  IAddress,
  { addressId: number; addressData: Partial<Omit<IAddress, "id">> }
>(
  "address/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<IAddress>(
        `${apiUrl}/api/addresses/${addressId}`,
        addressData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as IAddress;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memperbarui alamat."
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return addressId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menghapus alamat."
      );
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
      .addCase(
        createAddress.fulfilled,
        (state, action: PayloadAction<IAddress>) => {
          if (action.payload.isMain) {
            state.addresses.forEach((addr) => {
              addr.isMain = false;
            });
          }
          state.addresses.push(action.payload);
        }
      )
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<IAddress>) => {
          const index = state.addresses.findIndex(
            (addr) => addr.id === action.payload.id
          );
          if (index !== -1) {
            if (action.payload.isMain) {
              state.addresses.forEach((addr) => {
                addr.isMain = false;
              });
            }
            state.addresses[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.addresses = state.addresses.filter(
            (addr) => addr.id !== action.payload
          );
        }
      );
  },
});

export default addressSlice.reducer;
