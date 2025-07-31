// 'use client';

// import React, { useState } from 'react';
// import { Menu, Bell, LogOut } from 'lucide-react'; // 1. Hapus 'Settings' dari impor
// import AdminSidebar from '@/components/layout/StoreAdmin/sidebar'; 

// export default function StoreAdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50 antialiased text-gray-800">
//       {/* Sidebar untuk Desktop */}
//       <aside className="hidden lg:block w-[280px] flex-shrink-0">
//         <AdminSidebar />
//       </aside>

//       {/* Sidebar untuk Mobile (Overlay) */}
//       <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
//         <aside className={`absolute top-0 left-0 w-72 h-full bg-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           {/* Kita perlu cara untuk menutup sidebar dari dalam, misal dengan prop */}
//           <AdminSidebar />
//         </aside>
//       </div>

//       {/* Konten Utama */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header Konten Utama */}
//         <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200/60 px-6 flex justify-between items-center h-[68px] sticky top-0 z-30">
//           <button 
//             className="lg:hidden text-gray-600 p-2 -ml-2"
//             onClick={() => setIsSidebarOpen(true)}
//           >
//             <Menu className="h-6 w-6" />
//           </button>
//           <div className="flex-1"></div>
//           <div className="flex items-center gap-2">
//             {/* 2. Tombol/ikon Settings telah dihapus dari sini */}
//             <button className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
//               <Bell size={20} />
//             </button>
//             <button className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
//               <LogOut size={20} />
//             </button>
//           </div>
//         </header>

//         {/* Area Konten (di mana page.tsx akan dirender) */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, LogOut, ShoppingCart, CheckCircle2, Truck, XCircle } from 'lucide-react';
import AdminSidebar from '@/components/layout/StoreAdmin/sidebar'; 
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchRecentActivity } from '@/lib/redux/slice/storeadminDashboardSlice';
import { logoutAction } from '@/lib/redux/slice/authSlice';

// --- [BARU] Komponen untuk item aktivitas di dropdown ---
const ActivityItem: FC<{ log: any, onClick: () => void }> = ({ log, onClick }) => {
    const statusInfo = {
        PROCESSED: { icon: CheckCircle2, color: 'blue', text: `Pembayaran untuk pesanan #${log.order.id} telah dikonfirmasi.` },
        SHIPPED: { icon: Truck, color: 'purple', text: `Pesanan #${log.order.id} telah dikirim.` },
        CANCELED: { icon: XCircle, color: 'red', text: `Pesanan #${log.order.id} dibatalkan.` },
        default: { icon: ShoppingCart, color: 'gray', text: log.note || `Status pesanan #${log.order.id} diubah.` }
    };
    const info = statusInfo[log.newStatus as keyof typeof statusInfo] || statusInfo.default;
    const colorClasses = `bg-${info.color}-100 text-${info.color}-600`;

    return (
        <li onClick={onClick} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className={`${colorClasses} p-1.5 rounded-full mt-1`}>
                <info.icon size={16} />
            </span>
            <div className="flex-1">
                <p className="text-sm text-gray-700">{info.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(log.changedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </li>
    );
};


export default function StoreAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // --- [BARU] State untuk dropdown notifikasi ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { recentActivity } = useAppSelector((state) => state.storeAdminDashboard);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // --- [BARU] Ambil data aktivitas saat layout dimuat ---
  useEffect(() => {
    if (isAuthenticated) {
        dispatch(fetchRecentActivity());
    }
  }, [dispatch, isAuthenticated]);

  const handleNotificationClick = () => {
      setIsNotifOpen(false);
      // Arahkan ke halaman pesanan
      router.push('/store-admin/pesanan');
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 antialiased text-gray-800">
      {/* Sidebar untuk Desktop */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Sidebar untuk Mobile (Overlay) */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute top-0 left-0 w-72 h-full bg-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <AdminSidebar />
        </aside>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Konten Utama */}
        <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200/60 px-6 flex justify-between items-center h-[68px] sticky top-0 z-30">
          <button 
            className="lg:hidden text-gray-600 p-2 -ml-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            {/* --- [BARU] Tombol Notifikasi Dinamis --- */}
            <div className="relative">
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 relative"
                >
                    <Bell size={20} />
                    {recentActivity.length > 0 && (
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )}
                </button>
                {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                        <div className="p-3 border-b">
                            <h3 className="font-semibold text-sm text-gray-800">Aktivitas Terbaru</h3>
                        </div>
                        <ul className="p-2 max-h-80 overflow-y-auto">
                            {recentActivity.length > 0 ? (
                                recentActivity.map(log => <ActivityItem key={log.id} log={log} onClick={handleNotificationClick} />)
                            ) : (
                                <p className="text-center text-sm text-gray-500 py-4">Tidak ada notifikasi baru.</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Area Konten */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
