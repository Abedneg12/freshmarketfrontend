import React from "react";
import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useAppSelector } from "@/lib/redux/hooks";

export default function DetailOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selectedOrder, detailLoading, detailError } = useAppSelector((state) => state.adminorders);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-lg relative animate-in fade-in p-6">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={22} />
        </button>
        {detailLoading && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p>Memuat detail pesanan...</p>
          </div>
        )}
        {detailError && (
          <div className="text-red-500 text-center py-12">{detailError}</div>
        )}
        {selectedOrder && !detailLoading && (
          <>
            <h2 className="text-xl font-bold mb-2">Detail Pesanan FM-{selectedOrder.id}</h2>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={selectedOrder.status as any} />
              <span className="text-xs text-gray-500">
                {new Date(selectedOrder.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Pelanggan:</span> {selectedOrder.user.fullName} <span className="text-xs text-gray-400">({selectedOrder.user.email})</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Alamat:</span><br />
              <span className="text-gray-700 text-sm">{selectedOrder.address?.label} - {selectedOrder.address?.recipient}<br />
                {selectedOrder.address?.addressLine}, {selectedOrder.address?.city}, {selectedOrder.address?.province} ({selectedOrder.address?.postalCode})<br />
                Telp: {selectedOrder.address?.phone}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Total:</span>{' '}
              <span className="text-green-700 font-bold">
                Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Item Pesanan:</span>
              <ul className="pl-4 mt-1 space-y-2">
                {selectedOrder.items.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    {item.product.images[0]?.imageUrl && (
                      <img src={item.product.images[0]?.imageUrl} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <span className="font-medium">{item.product.name}</span>
                    <span className="ml-auto">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Bukti Pembayaran:</span><br />
              {selectedOrder.paymentProof ? (
                <img
                  src={selectedOrder.paymentProof.imageUrl}
                  alt="Bukti Bayar"
                  className="mt-1 w-60 rounded shadow border"
                  style={{ maxHeight: 240, objectFit: 'contain' }}
                />
              ) : (
                <span className="text-gray-500 text-sm">Belum ada bukti pembayaran di-upload.</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
