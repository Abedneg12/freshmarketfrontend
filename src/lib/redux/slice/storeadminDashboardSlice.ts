// src/lib/redux/slice/adminDashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { ISummaryData, IActivityLog , IAdminDashboardState} from '@/lib/interface/storeadmin.interface';

const initialState: IAdminDashboardState = {
    summary: null,
    recentActivity: [], // Nilai awal
    loading: false,
    error: null,
};


export const fetchDashboardSummary = createAsyncThunk<ISummaryData, void, { state: RootState }>(
    'adminDashboard/fetchSummary',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get<{ data: ISummaryData }>(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/dashboard/summary`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data dasbor.');
        }
    }
);

// [BARU] Thunk baru untuk mengambil aktivitas terbaru
export const fetchRecentActivity = createAsyncThunk<IActivityLog[], void, { state: RootState }>(
    'adminDashboard/fetchActivity',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get<{ data: IActivityLog[] }>(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/dashboard/recent-activity`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengambil aktivitas terbaru.');
        }
    }
);


const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Reducer untuk summary
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<ISummaryData>) => {
                state.loading = false;
                state.summary = action.payload;
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // [BARU] Reducer untuk aktivitas terbaru
            .addCase(fetchRecentActivity.fulfilled, (state, action: PayloadAction<IActivityLog[]>) => {
                // Tidak mengubah state loading utama agar tidak ada kedipan di kartu summary
                state.recentActivity = action.payload;
            })
            .addCase(fetchRecentActivity.rejected, (state, action) => {
                // Bisa menampilkan error spesifik untuk aktivitas jika perlu
                console.error("Failed to fetch recent activity:", action.payload);
            });
    },
});

export default adminDashboardSlice.reducer;
