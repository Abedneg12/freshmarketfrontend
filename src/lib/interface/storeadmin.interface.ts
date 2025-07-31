export interface ISummaryData {
    newOrders: number;
    lowStockProducts: number;
    dailyRevenue: number;
}


export interface IActivityLog {
    id: number;
    note: string | null;
    changedAt: string;
    order: { id: number };
    newStatus: string;
}

export interface IAdminDashboardState {
    summary: ISummaryData | null;
    recentActivity: IActivityLog[];
    loading: boolean;
    error: string | null;
}