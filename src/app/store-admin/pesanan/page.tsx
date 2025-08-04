'use client';

import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAdminOrders, confirmPayment, shipOrder, cancelOrder,
  clearAdminOrderActionStatus, fetchAdminOrderDetail, resetAdminOrderDetail,
} from "@/lib/redux/slice/adminorderslice";
import { Toaster, toast } from "sonner";
import AdminOrderTable from "@/components/orders/AdminOrderTable";
import ConfirmModal from "@/components/orders/ConfirmModal";
import Pagination from "@/components/orders/Pagination";
import DetailOrderModal from "@/components/orders/DetailOrderModal";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";


export default function AdminOrdersPage() {
  useAuthGuard({ requiredRole: ["STORE_ADMIN"], redirectTo: "/login" });
  const dispatch = useAppDispatch();
  const { orders, pagination, loading, error, actionLoading, actionError, actionSuccess } = useAppSelector((state) => state.adminorders);

  // State filter, search, page, modal
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modal, setModal] = useState<{ type: 'CONFIRM' | 'REJECT' | 'SHIP' | 'CANCEL' | null; orderId?: number } | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const filters: { page: number; status?: string; search?: string } = { page: currentPage };
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;
    dispatch(fetchAdminOrders(filters));
  }, [dispatch, currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    if (actionSuccess) {
      toast.success(actionSuccess);
      setModal(null);
      dispatch(fetchAdminOrders({ page: currentPage }));
      dispatch(clearAdminOrderActionStatus());
    }
    if (actionError) {
      toast.error(actionError);
      dispatch(clearAdminOrderActionStatus());
    }
  }, [actionSuccess, actionError, dispatch, currentPage]);

  // Handler konfirmasi di modal
  const handleAction = () => {
    if (!modal?.orderId || !modal.type) return;
    if (modal.type === 'CONFIRM') dispatch(confirmPayment({ orderId: modal.orderId, decision: 'APPROVE' }));
    if (modal.type === 'REJECT') dispatch(confirmPayment({ orderId: modal.orderId, decision: 'REJECT' }));
    if (modal.type === 'SHIP') dispatch(shipOrder({ orderId: modal.orderId }));
    if (modal.type === 'CANCEL') dispatch(cancelOrder({ orderId: modal.orderId }));
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  // Handler Eye click
  const handleDetail = (orderId: number) => {
    dispatch(fetchAdminOrderDetail(orderId));
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    dispatch(resetAdminOrderDetail());
  };

  return (
    <div className="space-y-8">
      <Toaster richColors position="top-right" />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manajemen Pesanan</h1>
        <p className="mt-1.5 text-gray-500">Lihat, kelola, dan proses semua pesanan yang masuk ke toko Anda.</p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID Pesanan atau Nama Pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          >
            <option value="all">Semua Status</option>
            <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
            <option value="PROCESSED">Diproses</option>
            <option value="SHIPPED">Dikirim</option>
            <option value="CONFIRMED">Selesai</option>
            <option value="CANCELED">Dibatalkan</option>
          </select>
          <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tabel Daftar Pesanan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <AdminOrderTable
          orders={orders}
          loading={loading}
          error={error}
          actionLoading={actionLoading}
          setModal={setModal}
          onDetail={handleDetail}
        />
        <Pagination pagination={pagination ?? { page: 1, totalPages: 1 }} onPageChange={handlePageChange} />
      </div>

      {/* Modal Konfirmasi Aksi */}
      <ConfirmModal
        show={!!modal}
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={handleAction}
        title={
          modal?.type === 'CONFIRM' ? 'Setujui Pembayaran?' :
            modal?.type === 'REJECT' ? 'Tolak Pembayaran?' :
              modal?.type === 'SHIP' ? 'Kirim Pesanan?' :
                modal?.type === 'CANCEL' ? 'Batalkan Pesanan?' : ''
        }
        description={
          modal?.type === 'CONFIRM' ? 'Apakah kamu yakin ingin menyetujui pembayaran pesanan ini?' :
            modal?.type === 'REJECT' ? 'Yakin menolak pembayaran? User harus upload bukti baru.' :
              modal?.type === 'SHIP' ? 'Pesanan akan dikirim ke pelanggan.' :
                modal?.type === 'CANCEL' ? 'Aksi ini akan membatalkan pesanan dan mengembalikan stok.' : ''
        }
        confirmLabel={
          modal?.type === 'CONFIRM' ? 'Approve' :
            modal?.type === 'REJECT' ? 'Reject' :
              modal?.type === 'SHIP' ? 'Kirim' :
                modal?.type === 'CANCEL' ? 'Batalkan' : ''
        }
      />

      {/* Modal Detail Order */}
      <DetailOrderModal open={detailOpen} onClose={handleCloseDetail} />
    </div>
  );
}
