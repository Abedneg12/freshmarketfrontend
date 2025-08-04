import React from "react";

type OrderStatus =
  | 'PROCESSED'
  | 'SHIPPED'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'WAITING_CONFIRMATION'
  | 'WAITING_FOR_PAYMENT';

const statusStyles: Record<OrderStatus, string> = {
  PROCESSED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELED: 'bg-red-100 text-red-700',
  WAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-700',
  WAITING_FOR_PAYMENT: 'bg-gray-100 text-gray-700',
};

const statusText: Record<OrderStatus, string> = {
  PROCESSED: 'Diproses',
  SHIPPED: 'Dikirim',
  CONFIRMED: 'Selesai',
  CANCELED: 'Dibatalkan',
  WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
  WAITING_FOR_PAYMENT: 'Menunggu Pembayaran',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusStyles[status]}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${statusStyles[status].replace('100', '400').replace('text-','bg-')}`}></span>
      {statusText[status]}
    </span>
  );
}
