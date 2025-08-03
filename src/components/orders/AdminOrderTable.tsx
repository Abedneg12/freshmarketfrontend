import React from "react";
import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Order {
  id: number;
  user: { fullName: string; email: string };
  createdAt: string;
  totalPrice: number;
  status: string;
}

export default function AdminOrderTable({
  orders,
  loading,
  error,
  actionLoading,
  setModal,
  onDetail,
}: {
  orders: Order[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  setModal: (m: any) => void;
  onDetail: (id: number) => void;
}) {
  return (
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
                <StatusBadge status={order.status as any} />
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => onDetail(order.id)}
                  aria-label="Lihat Detail"
                >
                  <Eye size={16} />
                </button>
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
  );
}
