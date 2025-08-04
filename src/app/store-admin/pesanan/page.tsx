'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  fetchAdminOrders,
  confirmPayment,
  shipOrder,
  cancelOrder,
  clearAdminOrderActionStatus,
} from '@/lib/redux/slice/adminorderslice';
import { Toaster, toast } from 'sonner';
import withStoreAdminAuth from '@/components/common/StoreAdminAuth';

// --- Komponen Modal Konfirmasi (Reusable) ---
const ConfirmModal = ({
  show,
  title,
  description,
  loading,
  onClose,
  onConfirm,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
}: {
  show: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 animate-in fade-in">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-1.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium"
          >{cancelLabel}</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1.5 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium"
          >
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Badge Status Pesanan ---
type OrderStatus = 'PROCESSED' | 'SHIPPED' | 'CONFIRMED' | 'CANCELED' | 'WAITING_CONFIRMATION' | 'WAITING_FOR_PAYMENT';

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusStyles = {
    PROCESSED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELED: 'bg-red-100 text-red-700',
    WAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-700',
    WAITING_FOR_PAYMENT: 'bg-gray-100 text-gray-700',
  };
  const statusText = {
    PROCESSED: 'Diproses',
    SHIPPED: 'Dikirim',
    CONFIRMED: 'Selesai',
    CANCELED: 'Dibatalkan',
    WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
    WAITING_FOR_PAYMENT: 'Menunggu Pembayaran',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusStyles[status]}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${statusStyles[status].replace('100', '400').replace('text-','bg-')}`}></span>
      {statusText[status]}
    </span>
  );
};

// --- Pagination ---
const Pagination = ({ pagination, onPageChange }: { pagination: any, onPageChange: (page: number) => void }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200/80">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Sebelumnya</span>
      </button>
      <span className="text-sm text-gray-700">
        Halaman {pagination.page} dari {pagination.totalPages}
      </span>
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>Berikutnya</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// --- Komponen Utama ---
function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, pagination, loading, error, actionLoading, actionError, actionSuccess } = useAppSelector((state) => state.adminorders);

  // State filter, search, page, modal
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modal, setModal] = useState<{
    type: 'CONFIRM' | 'REJECT' | 'SHIP' | 'CANCEL' | null;
    orderId?: number;
  } | null>(null);

  // Fetch orders saat filter/page/search berubah
  useEffect(() => {
    const filters: { page: number; status?: string; search?: string } = { page: currentPage };
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;
    dispatch(fetchAdminOrders(filters));
  }, [dispatch, currentPage, statusFilter, searchTerm]);

  // Handle toast dan close modal jika sukses/error
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
    // eslint-disable-next-line
  }, [actionSuccess, actionError]);

  // Handler konfirmasi di modal
  const handleAction = () => {
    if (!modal?.orderId || !modal.type) return;
    if (modal.type === 'CONFIRM') {
      dispatch(confirmPayment({ orderId: modal.orderId, decision: 'APPROVE' }));
    }
    if (modal.type === 'REJECT') {
      dispatch(confirmPayment({ orderId: modal.orderId, decision: 'REJECT' }));
    }
    if (modal.type === 'SHIP') {
      dispatch(shipOrder({ orderId: modal.orderId }));
    }
    if (modal.type === 'CANCEL') {
      dispatch(cancelOrder({ orderId: modal.orderId }));
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  // --- Render ---
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Memuat data pesanan...</p>
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-red-500">
                    <p>Terjadi kesalahan: {error}</p>
                  </td>
                </tr>
              )}
              {!loading && !error && orders.length > 0 && orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{`FM-${order.id}`}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.user.fullName}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium text-right whitespace-nowrap">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* View (nanti bisa modal/detail page) */}
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                      <Eye size={16} />
                    </button>
                    {/* Aksi Admin */}
                    {order.status === 'WAITING_CONFIRMATION' && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => setModal({ type: 'CONFIRM', orderId: order.id })}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md font-semibold text-xs hover:bg-green-200 disabled:opacity-50"
                        >Approve</button>
                        <button
                          disabled={actionLoading}
                          onClick={() => setModal({ type: 'REJECT', orderId: order.id })}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md font-semibold text-xs hover:bg-red-200 disabled:opacity-50"
                        >Reject</button>
                      </>
                    )}
                    {order.status === 'PROCESSED' && (
                      <button
                        disabled={actionLoading}
                        onClick={() => setModal({ type: 'SHIP', orderId: order.id })}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md font-semibold text-xs hover:bg-blue-200 disabled:opacity-50"
                      >Kirim</button>
                    )}
                    {(order.status === 'WAITING_FOR_PAYMENT' || order.status === 'PROCESSED') && (
                      <button
                        disabled={actionLoading}
                        onClick={() => setModal({ type: 'CANCEL', orderId: order.id })}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md font-semibold text-xs hover:bg-gray-200 disabled:opacity-50"
                      >Batalkan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Tidak ada pesanan yang cocok dengan filter Anda.</p>
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
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
    </div>
  );
}

export default withStoreAdminAuth(AdminOrdersPage);
