'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboardIcon, StoreIcon, UsersIcon, BarChart3Icon, LogOutIcon, PackageIcon, PercentCircleIcon, Layers, NotebookPenIcon } from 'lucide-react';

interface SidebarProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

export default function Sidebar({ showMenu, setShowMenu }: SidebarProps) {
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboardIcon, id: 'dashboard', path: '/dashboard' },
    { name: 'Order', icon: NotebookPenIcon, id: 'reports', path: '/order' },
    { name: 'Store Management', icon: StoreIcon, id: 'stores', path: '/store' },
    { name: 'Inventory', icon: PackageIcon, id: 'inventory', path: '/inventory' },
    { name: 'Discount', icon: PercentCircleIcon, id: 'discount', path: '/discount' },
    { name: 'Category', icon: Layers, id: 'category', path: '/category' },
    { name: 'Admin Accounts', icon: UsersIcon, id: 'admins', path: '/admins' },
    { name: 'Reports', icon: BarChart3Icon, id: 'reports', path: '/reports' },
    
  ];

  const handleNavigation = (path: string) => {
    setShowMenu(false); // Hide sidebar on mobile after navigation
    router.push(path);
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-30 w-64 transition-transform transform bg-green-700 pt-5 pb-4 overflow-y-auto
        ${showMenu ? 'translate-x-0' : '-translate-x-full'}
        md:static md:inset-auto md:translate-x-0
      `}
    >
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-white font-bold text-xl">Freshmart Admin</h1>
        {/* Close button for mobile */}
        <button
          className="md:hidden ml-auto text-white"
          onClick={() => setShowMenu(false)}
        >
          ✕
        </button>
      </div>
      <div className="mt-8 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map(item => (
            <button
              key={item.name}
              className="group flex items-center w-full px-2 py-2 text-base md:text-sm font-medium rounded-md cursor-pointer text-left text-white hover:bg-green-800"
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" /> {item.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="px-2 mt-6">
        <button className="w-full flex items-center px-2 py-2 text-base md:text-sm font-medium rounded-md text-green-100 hover:bg-green-600">
          <LogOutIcon className="mr-3 flex-shrink-0 h-6 w-6 text-green-300" />
          Sign Out
        </button>
      </div>
    </div>
  );
}