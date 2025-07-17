'use client';

import React, { useState } from 'react';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import AdminSidebar from '@/components/storead/sidebar'; 

export default function StoreAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 antialiased text-gray-800">
      {/* Sidebar untuk Desktop */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Sidebar untuk Mobile (Overlay) */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute top-0 left-0 w-72 h-full bg-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Kita perlu cara untuk menutup sidebar dari dalam, misal dengan prop */}
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
            <button className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Area Konten (di mana page.tsx akan dirender) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
